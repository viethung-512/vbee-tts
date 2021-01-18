import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { v4 as uuid } from 'uuid';
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
import { getEnv } from '../configs/env-config';
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
import { allophoneService } from './allophone-service';
import { UploadedFile } from 'express-fileupload';

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

const getProgresses = async (
  types: SentenceType[],
  idsCompleted: string[]
): Promise<
  {
    type: SentenceType;
    total: number;
    current: number;
    percent: number;
  }[]
> => {
  const sentenceDao = new SentenceDao();

  const sentences = await Promise.all(
    idsCompleted.map(async id => {
      const sentence = await sentenceDao.findItem(id);
      return sentence!;
    })
  );

  const result = await Promise.all(
    types.map(async type => {
      const { totalDocs: total } = await sentenceDao.findAll({
        paginateQuery: {},
        needAll: true,
        options: {
          status: SentenceStatus.APPROVED,
          type: type,
        },
      });
      const current = sentences.filter(sentence => sentence.type === type)
        .length;

      const percent = total === 0 ? 0 : (current * 100) / total;

      return {
        type: type,
        total: total,
        current: current,
        percent: percent,
      };
    })
  );

  return result;
};

const getBroadcasters = async (
  query: PaginateQuery
): Promise<GetBroadcastersResponse> => {
  const broadcasterDao = new BroadcasterDao();
  const paginated = await broadcasterDao.findAll({ paginateQuery: query });

  const newBroadcasters = await Promise.all(
    paginated.docs.map(async doc => {
      const progresses = await getProgresses(doc.types, doc.completed);
      return {
        user: doc.user,
        voice: doc.voice,
        types: doc.types,
        completed: doc.completed,
        id: doc._id,
        dialect: doc.dialect,
        expiredAt: doc.expiredAt,
        progresses,
      };
    })
  );

  return {
    success: true,
    paginatedBroadcasters: { ...paginated, docs: newBroadcasters as any },
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
      // _id: { $nin: broadcaster.completed },
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
      // _id: { $nin: broadcaster.completed },
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
    uid: sentence.manual_uid || sentence.uid,
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

  const record = await recordDao.findItem({
    uid: sentence.manual_uid || sentence.uid,
  });
  const voice = await voiceDao.findItem(broadcaster.voice.id);
  if (!record) {
    const { success, allophone } = await allophoneService.getAllophone({
      text: sentence.original,
      voice: voice!.code,
      dialect: dialect,
    });
    if (success) {
      const updated = await recordDao.createItem({
        uid: sentence.manual_uid || sentence.uid,
        type: sentence.type,
        status: SentenceStatus.INITIAL,
        voice: voice!,
        sentence: sentence,
        original: sentence.original,
        dialect: dialect,
        allophoneContent: allophone,
      });

      await historyDao.createItem({
        event: HistoryEvent.INSERT,
        entity: HistoryEntity.RECORD,
        user: user,
        record: updated,
      });
    } else {
      console.log('can not get allophone content');
    }
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

const uploadAudio = async (
  file: UploadedFile,
  authUserId: string
): Promise<ServiceResponse> => {
  const { staticHost } = getEnv();
  const fileExtension = file.name.split('.')[file.name.split('.').length - 1];
  const randomFilename = `${uuid()}.${fileExtension}`;
  const userDao = new UserDao();
  const recordDao = new RecordDao();
  const historyDao = new HistoryDao();

  await file.mv(`./${randomFilename}`);

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(`./${randomFilename}`));

    const { data } = await axios.post(
      `${staticHost}/api/static/upload-audio`,
      // `http://localhost:3000/upload-audio`,
      form,
      {
        headers: { ...form.getHeaders() },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    fs.unlinkSync(`./${randomFilename}`);
    console.log('end upload file');
    console.log(data);

    const user = await userDao.findItem(authUserId);

    await Promise.all(
      data!.map(async (file: any) => {
        const uid = parseInt(
          file.split('/')[file.split('/').length - 1].split('.')[0]
        );

        const record = await recordDao.findItem({ uid });
        if (record) {
          const updatedRecord = await recordDao.updateItem(record, {
            audioURL: file,
          });
          await historyDao.createItem({
            event: HistoryEvent.UPDATE,
            entity: HistoryEntity.RECORD,
            user: user!,
            record: updatedRecord,
          });
        }
      })
    );

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      errors: [{ message: 'Error while upload audio' }],
    };
  }
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
  uploadAudio,
};

export { broadcasterService };
