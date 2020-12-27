import mongoose from 'mongoose';
import {
  AuthUser,
  DialectType,
  HistoryEntity,
  HistoryEvent,
  PaginateQuery,
  PaginateResponse,
  SentenceStatus,
  SentenceType,
  ServiceResponse,
} from '@tts-dev/common';
import { BroadcasterDao } from '../daos/broadcaster-dao';
import { SentenceDao } from '../daos/sentence-dao';
import { UserDao } from '../daos/user-dao';
import { VoiceDao } from '../daos/voice-dao';
import {
  BroadcasterAttrs,
  BroadcasterDoc,
  BroadcasterSentence,
} from '../models/broadcaster';
import { SentenceDoc } from '../models/sentence';
import { RecordDao } from '../daos/record-dao';
import { HistoryDao } from '../daos/history-dao';
import { RecordDoc } from '../models/record';

interface PaginatedBroadcaster extends PaginateResponse {
  docs: BroadcasterDoc[];
}

interface PaginatedBroadcasterSentence extends PaginateResponse {
  docs: BroadcasterSentence[];
}

interface GetBroadcastersResponse extends ServiceResponse {
  paginatedBroadcasters?: PaginatedBroadcaster;
}

interface GetBroadcasterResponse extends ServiceResponse {
  broadcaster?: BroadcasterDoc;
}

interface GetBroadcasterSentenceResponse extends ServiceResponse {
  broadcasterSentence?: BroadcasterSentence;
}

interface GetBroadcasterSentencesResponse extends ServiceResponse {
  paginatedBroadcasterSentences?: PaginatedBroadcasterSentence;
}

interface GetInitBroadcasterSentenceResponse extends ServiceResponse {
  broadcasterSentenceId?: string | null;
}

interface CreateBroadcasterResponse extends ServiceResponse {
  broadcaster?: BroadcasterDoc;
}

interface UpdateBroadcasterResponse extends ServiceResponse {
  broadcaster?: BroadcasterDoc;
}

interface DeleteBroadcastersResponse extends ServiceResponse {
  broadcasters?: BroadcasterDoc[];
}

interface CheckBroadcasterResponse extends ServiceResponse {
  isBroadcaster: boolean;
}

interface ToggleFinishRecordResponse extends ServiceResponse {
  broadcasterSentence?: BroadcasterSentence;
}

interface SubmitErrorBroadcasterSentenceResponse extends ServiceResponse {
  record?: RecordDoc;
}

const getBroadcasters = async (
  query: PaginateQuery
): Promise<GetBroadcastersResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const paginated = await broadcasterDao.findAll({ paginateQuery: query });

  return {
    success: true,
    paginatedBroadcasters: paginated,
  };
};

const getBroadcaster = async (id: string): Promise<GetBroadcasterResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const broadcaster = await broadcasterDao.findItem(id);
  if (!broadcaster) {
    return {
      success: false,
      errors: [{ message: 'Broadcaster not found' }],
    };
  }

  return { success: true, broadcaster };
};

const createBroadcaster = async (
  data: BroadcasterAttrs
): Promise<CreateBroadcasterResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const userDao = new UserDao();
  const voiceDao = new VoiceDao();

  const user = await userDao.findItem(data.user);
  const voice = await voiceDao.findItem(data.voice);

  const broadcaster = await broadcasterDao.createItem({
    types: data.types,
    completed: [],
    user: {
      id: user!.id,
      username: user!.username,
      email: user!.email,
      phoneNumber: user!.phoneNumber,
      role: user!.role,
    },
    voice: {
      id: voice!.id,
      name: voice!.name,
      code: voice!.code,
    },
    dialect: data.dialect,
    expiredAt: data.expiredAt,
  });

  return { success: true, broadcaster };
};

const updateBroadcaster = async (
  id: string,
  data: Partial<BroadcasterAttrs>
): Promise<UpdateBroadcasterResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const userDao = new UserDao();
  const voiceDao = new VoiceDao();

  const broadcaster = await broadcasterDao.findItem(id);
  if (!broadcaster) {
    return {
      success: false,
      errors: [{ message: 'Broadcaster not found' }],
    };
  }

  if (data.user) {
    const user = await userDao.findItem(data.user);
    data.user = {
      id: user!.id,
      username: user!.username,
      email: user!.email,
      phoneNumber: user!.phoneNumber,
      role: user!.role,
    };
  }
  if (data.voice) {
    const voice = await voiceDao.findItem(data.voice);
    data.voice = {
      id: voice!.id,
      name: voice!.name,
      code: voice!.code,
    };
  }

  const updated = await broadcasterDao.updateItem(broadcaster, data);

  return { success: true, broadcaster: updated };
};

const deleteBroadcasters = async (
  ids: string[]
): Promise<DeleteBroadcastersResponse> => {
  const broadcasterDao = new BroadcasterDao();

  const deletedBroadcasters = await Promise.all(
    ids.map(async id => {
      const broadcaster = await broadcasterDao.findItem(id);
      await broadcasterDao.deleteItem(broadcaster!);

      return broadcaster!;
    })
  );

  return { success: true, broadcasters: deletedBroadcasters };
};

const checkBroadcaster = async (
  id: string
): Promise<CheckBroadcasterResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(id);

  if (!user) {
    return {
      success: false,
      errors: [{ message: 'User not found' }],
      isBroadcaster: false,
    };
  }

  const { docs } = await broadcasterDao.findAll({
    paginateQuery: {},
    needAll: true,
  });

  const broadcaster = (docs as BroadcasterDoc[]).find(doc => {
    return doc.user.id === id;
  });

  if (!broadcaster) {
    return {
      success: false,
      errors: [{ message: 'User is not a broadcaster' }],
      isBroadcaster: false,
    };
  }

  return { success: true, isBroadcaster: true };
};

const getBroadcasterSentence = async (
  sentenceId: string,
  dialect: DialectType
): Promise<GetBroadcasterSentenceResponse> => {
  const sentenceDao = new SentenceDao();
  const broadcasterDao = new BroadcasterDao();

  const sentence = await sentenceDao.findItem(sentenceId);
  if (!sentence) {
    return {
      success: false,
      errors: [{ message: 'Sentence not found' }],
    };
  }

  const broadcaster = await broadcasterDao.findItem({ types: sentence.type });
  if (!broadcaster) {
    return {
      success: false,
      errors: [{ message: 'This sentence is not broadcaster sentence' }],
    };
  }

  const broadcasterSentence: BroadcasterSentence = {
    id: sentence.id,
    uid: sentence.uid,
    completed: broadcaster.completed.includes(sentenceId),
    type: sentence.type,
    dialect: dialect,
    original: sentence.original,
    pronunciation: sentence.dialects.find(d => d.name === dialect)!
      .pronunciation,
    dialectImage: sentence.dialects.find(d => d.name === dialect)!.image,
    originalImage: sentence.dialects.find(d => d.name === dialect)!
      .originalImage,
  };

  return {
    success: true,
    broadcasterSentence,
  };
};

const getBroadcasterSentences = async (
  query: PaginateQuery
): Promise<GetBroadcasterSentencesResponse> => {
  const broadcasterDao = new BroadcasterDao();

  const paginated = await broadcasterDao.findBroadcasterSentences(query);

  return {
    success: true,
    paginatedBroadcasterSentences: paginated,
  };
};

const getInitBroadcasterSentence = async (
  type: SentenceType,
  dialect: DialectType
): Promise<GetInitBroadcasterSentenceResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const sentenceDao = new SentenceDao();

  const broadcaster = await broadcasterDao.findItem({
    types: type,
    dialect: dialect,
  });

  if (!broadcaster) {
    return {
      success: true,
      broadcasterSentenceId: null,
    };
  }

  const { docs, totalDocs } = await sentenceDao.findAll({
    paginateQuery: {},
    needAll: true,
    options: {
      type: type,
      _id: { $nin: broadcaster.completed },
      status: SentenceStatus.APPROVED,
    },
    sort: { uid: 1 },
  });

  if (totalDocs === 0) {
    return {
      success: true,
      broadcasterSentenceId: null,
    };
  }

  return {
    success: true,
    broadcasterSentenceId: (docs[0] as SentenceDoc).id,
  };
};

const getFirstSentence = async (authUser: AuthUser) => {
  const first = await getRelatedSentence(authUser, 'first');
  return first;
};

const getLastSentence = async (authUser: AuthUser) => {
  const last = await getRelatedSentence(authUser, 'last');
  return last;
};

const getNextSentence = async (authUser: AuthUser, currentId: string) => {
  const next = await getRelatedSentence(authUser, 'next', currentId);
  return next;
};

const getPreviousSentence = async (authUser: AuthUser, currentId: string) => {
  const previous = await getRelatedSentence(authUser, 'previous', currentId);
  return previous;
};

const getRelatedSentence = async (
  authUser: AuthUser,
  type: 'first' | 'last' | 'next' | 'previous',
  currentId?: string
): Promise<string | null> => {
  const sentenceDao = new SentenceDao();
  const broadcasterDao = new BroadcasterDao();

  const { docs } = await broadcasterDao.findAll({
    paginateQuery: {},
    needAll: true,
  });
  const broadcaster = (docs as BroadcasterDoc[]).find(
    doc => doc.user.id === authUser.id
  );

  if (!broadcaster) {
    return null;
  }

  const {
    docs: sentences,
    totalDocs: totalSentences,
  } = await sentenceDao.findAll({
    paginateQuery: {},
    needAll: true,
    options: {
      _id: { $nin: broadcaster.completed },
      status: SentenceStatus.APPROVED,
    },
    sort: { uid: 1 },
  });

  if (totalSentences === 0) {
    return null;
  }

  if (type === 'first') {
    return (sentences[0] as SentenceDoc).id;
  }
  if (type === 'last') {
    return (sentences[totalSentences - 1] as SentenceDoc).id;
  }

  for (let i = 0; i < totalSentences; i++) {
    if ((sentences[i] as SentenceDoc).id.toString() === currentId!.toString()) {
      if (type === 'next') {
        if (i === totalSentences - 1) {
          return null;
        }

        return (sentences[i + 1] as SentenceDoc).id;
      }
      if (type === 'previous') {
        if (i === 0) {
          return null;
        }

        return (sentences[i - 1] as SentenceDoc).id;
      }
    }
  }

  return null;
};

const toggleFinishRecord = async (
  id: string,
  dialect: DialectType,
  authUserId: string
): Promise<ToggleFinishRecordResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const userDao = new UserDao();
  const sentenceDao = new SentenceDao();
  const recordDao = new RecordDao();
  const voiceDao = new VoiceDao();
  const historyDao = new HistoryDao();

  const user = await userDao.findItem(authUserId);
  if (!user) {
    return {
      success: false,
      errors: [{ message: 'User not found' }],
    };
  }

  const { docs } = await broadcasterDao.findAll({
    paginateQuery: {},
    needAll: true,
  });
  const broadcaster = (docs as BroadcasterDoc[]).find(
    doc => doc.user.id.toString() === authUserId.toString()
  );
  if (!broadcaster) {
    return {
      success: false,
      errors: [{ message: 'Can not find broadcaster with this user' }],
    };
  }

  const sentence = await sentenceDao.findItem(id);
  if (!sentence) {
    return {
      success: false,
      errors: [{ message: 'Sentence not found' }],
    };
  }

  const broadcasterSentence: BroadcasterSentence = {
    id: sentence.id,
    uid: sentence.uid,
    completed: false,
    type: sentence.type,
    dialect: dialect,
    original: sentence.original,
    originalImage: sentence.dialects.find(d => d.name === dialect)!
      .originalImage,
    dialectImage: sentence.dialects.find(d => d.name === dialect)!.image,
    pronunciation: sentence.dialects.find(d => d.name === dialect)!
      .pronunciation,
  };

  if (broadcaster.completed.includes(id)) {
    broadcaster.completed = broadcaster.completed.filter(
      cp => cp.toString() !== id.toString()
    );
    broadcasterSentence.completed = false;
  } else {
    broadcaster.completed = [...broadcaster.completed, id];
    broadcasterSentence.completed = true;
  }

  await broadcaster.save();

  const record = await recordDao.findItem({ uid: sentence.uid });
  const voice = await voiceDao.findItem(broadcaster.voice.id);
  if (!record) {
    const updated = await recordDao.createItem({
      uid: sentence.uid,
      type: sentence.type,
      status: SentenceStatus.INITIAL,
      voice: voice!,
      sentence: sentence,
      original: sentence.original,
      dialect: dialect,
    });

    await historyDao.createItem({
      event: HistoryEvent.INSERT,
      entity: HistoryEntity.RECORD,
      user: user,
      record: updated,
    });
  }

  return {
    success: true,
    broadcasterSentence,
  };
};

const submitErrorBroadcasterSentence = async (
  uid: number,
  errorMessage: string,
  authUserId: string
): Promise<SubmitErrorBroadcasterSentenceResponse> => {
  const recordDao = new RecordDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(authUserId);

  const record = await recordDao.findItem({ uid });
  if (!record) {
    return {
      success: false,
      errors: [{ message: 'This sentence is not have any record' }],
    };
  }

  record.status = SentenceStatus.ERROR;
  record.errorMessage = errorMessage;
  await record.save();

  await historyDao.createItem({
    event: HistoryEvent.ERROR,
    entity: HistoryEntity.RECORD,
    user: user!,
    record: record,
  });

  return {
    success: true,
    record: record,
  };
};

const broadcasterService = {
  getBroadcasters,
  getBroadcaster,
  createBroadcaster,
  updateBroadcaster,
  deleteBroadcasters,
  checkBroadcaster,
  getBroadcasterSentences,
  getBroadcasterSentence,
  getInitBroadcasterSentence,
  getFirstSentence,
  getLastSentence,
  getNextSentence,
  getPreviousSentence,
  toggleFinishRecord,
  submitErrorBroadcasterSentence,
};

export { broadcasterService };
