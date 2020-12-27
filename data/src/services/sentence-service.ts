import {
  FilterFieldQuery,
  HistoryEntity,
  HistoryEvent,
  SentenceStatus,
  SentenceType,
  DialectType,
  AuthUser,
} from '@tts-dev/common';
import mongoose from 'mongoose';
import {
  PaginateQuery,
  PaginateResponse,
  ServiceResponse,
} from '@tts-dev/common';

import { SentenceDao } from '../daos/sentence-dao';
import { HistoryDao } from '../daos/history-dao';
import { UserDao } from '../daos/user-dao';
import {
  Sentence,
  SentenceAttrs,
  SentenceDoc,
  SentenceModel,
} from '../models/sentence';
import { SentenceSubmittedPublisher } from '../events/publishers/sentence-submitted-publisher';
import { natsWrapper } from '../nats-wrapper';

interface PaginatedSentence extends PaginateResponse {
  docs: SentenceDoc[];
}

interface GetSentencesResponse extends ServiceResponse {
  paginatedSentences?: PaginatedSentence;
}

interface GetSentenceResponse extends ServiceResponse {
  sentence?: SentenceDoc;
}

interface ImportSentencesResponse extends ServiceResponse {
  sentences?: SentenceDoc[];
}

interface SubmitSentenceResponse extends ServiceResponse {
  sentence?: SentenceDoc;
}
interface SubmitErrorSentenceResponse extends ServiceResponse {
  sentence?: SentenceDoc;
}

interface AssignSentencesResponse extends ServiceResponse {
  sentences?: SentenceDoc[];
}

interface ApproveSentencesResponse extends ServiceResponse {
  sentences?: SentenceDoc[];
}

interface DeleteSentencesResponse extends ServiceResponse {
  sentences?: SentenceDoc[];
}

const getFirstSentence = async (authUser: AuthUser, isRootUser: boolean) => {
  const first = await getRelatedSentence(authUser, isRootUser, 'first');
  return first;
};

const getLastSentence = async (authUser: AuthUser, isRootUser: boolean) => {
  const last = await getRelatedSentence(authUser, isRootUser, 'last');
  return last;
};

const getNextSentence = async (
  authUser: AuthUser,
  isRootUser: boolean,
  currentId: string
) => {
  const next = await getRelatedSentence(
    authUser,
    isRootUser,
    'next',
    currentId
  );
  return next;
};

const getPreviousSentence = async (
  authUser: AuthUser,
  isRootUser: boolean,
  currentId: string
) => {
  const previous = await getRelatedSentence(
    authUser,
    isRootUser,
    'previous',
    currentId
  );
  return previous;
};

const getRelatedSentence = async (
  authUser: AuthUser,
  isRootUser: boolean,
  type: 'first' | 'last' | 'next' | 'previous',
  currentId?: string
) => {
  const sentenceDao = new SentenceDao();
  const searchOptions: mongoose.FilterQuery<SentenceModel> = {};

  if (!isRootUser) {
    searchOptions.checker = authUser.id;
  }

  const { docs, totalDocs } = await sentenceDao.findAll({
    needAll: true,
    paginateQuery: {},
    options: searchOptions,
  });

  if (totalDocs === 0) {
    return null;
  }

  if (type === 'first') {
    return docs[0].id;
  }
  if (type === 'last') {
    return docs[totalDocs - 1].id;
  }

  for (let i = 0; i < totalDocs; i++) {
    if (docs[i].id.toString() === currentId!.toString()) {
      if (type === 'next') {
        if (i === totalDocs - 1) {
          return null;
        }
        return docs[i + 1].id;
      }

      if (type === 'previous') {
        if (i === 0) {
          return null;
        }
        return docs[i - 1].id;
      }
    }
  }
};

const getSentences = async (
  userId: string,
  isRootUser: boolean,
  query: PaginateQuery,
  filters?: FilterFieldQuery[]
): Promise<GetSentencesResponse> => {
  const sentenceDao = new SentenceDao();
  const userDao = new UserDao();

  const checker = await userDao.findItem(userId);
  const searchOptions: mongoose.FilterQuery<SentenceDoc> = {
    status: { $ne: SentenceStatus.APPROVED },
  };
  if (!isRootUser) {
    searchOptions.checker = checker!;
  }
  console.log({ filters });
  if (filters && filters.length > 0) {
    filters.forEach(filter => {
      searchOptions[filter.field] = { $in: filter.data };
    });
  }

  const paginated = await sentenceDao.findAll({
    paginateQuery: query,
    options: searchOptions,
  });

  return {
    success: true,
    paginatedSentences: paginated,
  };
};

const getSentence = async (id: string): Promise<GetSentenceResponse> => {
  const sentenceDao = new SentenceDao();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      success: false,
      errors: [{ message: 'Sentence not found' }],
    };
  }

  const sentence = await sentenceDao.findItem(id);
  if (!sentence) {
    return {
      success: false,
      errors: [{ message: 'Sentence not found' }],
    };
  }

  return { success: true, sentence };
};

const importSentences = async (
  userId: string,
  data: {
    content: string;
    type: SentenceType;
  }[]
): Promise<ImportSentencesResponse> => {
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);

  const imported = await Promise.all(
    data.map(async d => {
      const sentence = Sentence.build({
        raw: d.content,
        original: d.content,
        type: d.type,
        status: SentenceStatus.INITIAL,
        dialects: Object.values(DialectType).map(dialect => ({
          name: dialect,
          pronunciation: d.content,
        })),
      });
      await sentence.save();
      await historyDao.createItem({
        event: HistoryEvent.IMPORT,
        entity: HistoryEntity.SENTENCE,
        sentence: sentence,
        user: user!,
      });

      return sentence;
    })
  );

  return { success: true, sentences: imported };
};

const submitSentence = async (
  userId: string,
  id: string,
  submitData: {
    original?: string;
    dialectHN?: string;
    dialectSG?: string;
  }
): Promise<SubmitSentenceResponse> => {
  const sentenceDao = new SentenceDao();
  const userDao = new UserDao();
  const historyDao = new HistoryDao();

  const sentence = await sentenceDao.findItem(id);
  const user = await userDao.findItem(userId);

  const newDialects = sentence!.dialects.map(dialect => {
    if (dialect.name === DialectType.HANOI && submitData.dialectHN) {
      dialect.pronunciation = submitData.dialectHN;
    }
    if (dialect.name === DialectType.SAIGON && submitData.dialectSG) {
      dialect.pronunciation = submitData.dialectSG;
    }

    return dialect;
  });

  await new SentenceSubmittedPublisher(natsWrapper.client).publish({
    userId: userId,
    sentenceId: id,
    dialectId: DialectType.HANOI,
    pronunciation: submitData.dialectHN!,
    sentenceOriginal: sentence!.original,
  });
  await new SentenceSubmittedPublisher(natsWrapper.client).publish({
    userId: userId,
    sentenceId: id,
    dialectId: DialectType.SAIGON,
    pronunciation: submitData.dialectSG!,
    sentenceOriginal: sentence!.original,
  });

  await sentenceDao.updateItem(sentence!, {
    dialects: newDialects,
    original: submitData.original,
    status: SentenceStatus.SUBMITTED,
  });
  await historyDao.createItem({
    event: HistoryEvent.SUBMIT,
    entity: HistoryEntity.SENTENCE,
    user: user!,
    sentence: sentence!,
  });

  return { success: true, sentence: sentence! };
};

const submitErrorSentence = async (
  userId: string,
  id: string,
  errorMessage: string
): Promise<SubmitErrorSentenceResponse> => {
  const sentenceDao = new SentenceDao();
  const userDao = new UserDao();
  const historyDao = new HistoryDao();

  const user = await userDao.findItem(userId);
  const sentence = await sentenceDao.findItem(id);

  const updatedSentence = await sentenceDao.updateItem(sentence!, {
    status: SentenceStatus.ERROR,
    errorMessage: errorMessage,
  });

  await historyDao.createItem({
    event: HistoryEvent.ERROR,
    entity: HistoryEntity.SENTENCE,
    sentence: updatedSentence,
    user: user!,
  });

  return { success: true, sentence: updatedSentence };
};

const assignSentences = async (
  userId: string,
  assignData: {
    ids?: string[];
    type?: SentenceType;
    count?: number;
    checker: string;
  }
): Promise<AssignSentencesResponse> => {
  if (!assignData.ids && (!assignData.type || !assignData.count)) {
    return {
      success: false,
      errors: [{ message: 'Invalid Assign args, please try again' }],
    };
  }

  const sentenceDao = new SentenceDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);
  const checker = await userDao.findItem(assignData.checker);

  if (assignData.ids) {
    const assignedSentences = await Promise.all(
      assignData.ids.map(async id => {
        const sentence = await sentenceDao.findItem(id);

        await sentenceDao.updateItem(sentence!, {
          status: SentenceStatus.ASSIGNED,
          checker: checker!,
        });
        await historyDao.createItem({
          event: HistoryEvent.ASSIGN,
          entity: HistoryEntity.SENTENCE,
          sentence: sentence,
          user: user!,
        });

        return sentence!;
      })
    );

    return { success: true, sentences: assignedSentences };
  }

  const { totalDocs, docs } = await sentenceDao.findAll({
    needAll: true,
    paginateQuery: {},
    options: { checker: { $exists: false }, type: { $eq: assignData.type } },
  });
  const sentences = docs.slice(
    0,
    Math.min(assignData.count!, totalDocs)
  ) as SentenceDoc[];

  const assignedSentences = await Promise.all(
    sentences.map(async sentence => {
      await sentenceDao.updateItem(sentence!, {
        status: SentenceStatus.ASSIGNED,
        checker: checker!,
      });
      await historyDao.createItem({
        event: HistoryEvent.ASSIGN,
        entity: HistoryEntity.SENTENCE,
        sentence: sentence,
        user: user!,
      });

      return sentence!;
    })
  );

  return { success: true, sentences: assignedSentences };
};

const approveSentences = async (
  userId: string,
  ids: string[]
): Promise<ApproveSentencesResponse> => {
  const sentenceDao = new SentenceDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);

  const approvedSentences = await Promise.all(
    ids.map(async id => {
      const sentence = await sentenceDao.findItem(id);

      await sentenceDao.updateItem(sentence!, {
        status: SentenceStatus.APPROVED,
      });
      await historyDao.createItem({
        event: HistoryEvent.APPROVE,
        entity: HistoryEntity.SENTENCE,
        sentence: sentence,
        user: user!,
      });

      return sentence!;
    })
  );

  return { success: true, sentences: approvedSentences };
};

const deleteSentences = async (
  userId: string,
  ids: string[]
): Promise<DeleteSentencesResponse> => {
  const sentenceDao = new SentenceDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);

  const deletedSentences = await Promise.all(
    ids.map(async id => {
      const sentence = await sentenceDao.findItem(id);

      await sentenceDao.deleteItem(sentence!);
      await historyDao.createItem({
        event: HistoryEvent.DELETE,
        entity: HistoryEntity.SENTENCE,
        sentence: sentence,
        user: user!,
      });

      return sentence!;
    })
  );

  return { success: true, sentences: deletedSentences };
};

const sentenceService = {
  getSentences,
  getSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
  importSentences,
  submitSentence,
  submitErrorSentence,
  assignSentences,
  approveSentences,
  deleteSentences,
};

export { sentenceService };
