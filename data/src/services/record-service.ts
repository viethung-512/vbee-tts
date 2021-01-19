import mongoose from 'mongoose';
import {
  AuthUser,
  FilterFieldQuery,
  HistoryEntity,
  HistoryEvent,
  PaginateQuery,
  PaginateResponse,
  SentenceStatus,
  SentenceType,
  ServiceResponse,
} from '@tts-dev/common';
import { HistoryDao } from '../daos/history-dao';
import { RecordDao } from '../daos/record-dao';
import { UserDao } from '../daos/user-dao';
import { RecordDoc, RecordModel } from '../models/record';
import { allophoneService } from './allophone-service';

interface PaginatedRecord extends PaginateResponse {
  docs: RecordDoc[];
}

interface GetRecordsResponse extends ServiceResponse {
  paginatedRecords?: PaginatedRecord;
}

interface GetRecordResponse extends ServiceResponse {
  record?: RecordDoc;
}

interface ImportRecordsResponse extends ServiceResponse {
  records?: RecordDoc[];
}

interface SubmitRecordResponse extends ServiceResponse {
  record?: RecordDoc;
}
interface SubmitErrorRecordResponse extends ServiceResponse {
  record?: RecordDoc;
}

interface AssignRecordsResponse extends ServiceResponse {
  records?: RecordDoc[];
}

interface ApproveRecordsResponse extends ServiceResponse {
  records?: RecordDoc[];
}

interface DeleteRecordsResponse extends ServiceResponse {
  records?: RecordDoc[];
}

const getRecords = async (
  userId: string,
  isRootUser: boolean,
  query: PaginateQuery,
  filters?: FilterFieldQuery[]
): Promise<GetRecordsResponse> => {
  const recordDao = new RecordDao();
  const userDao = new UserDao();

  const checker = await userDao.findItem(userId);
  const searchOptions: mongoose.FilterQuery<RecordDoc> = {
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

  const paginated = await recordDao.findAll({
    paginateQuery: query,
    options: searchOptions,
  });

  return {
    success: true,
    paginatedRecords: paginated,
  };
};

const getRecord = async (id: string): Promise<GetRecordResponse> => {
  const recordDao = new RecordDao();
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      success: false,
      errors: [{ message: 'Record not found' }],
    };
  }

  const record = await recordDao.findItem(id);
  if (!record) {
    return {
      success: false,
      errors: [{ message: 'Record not found' }],
    };
  }

  return { success: true, record };
};

const getFirstRecord = async (authUser: AuthUser, isRootUser: boolean) => {
  const first = await getRelatedSentence(authUser, isRootUser, 'first');
  return first;
};

const getLastRecord = async (authUser: AuthUser, isRootUser: boolean) => {
  const last = await getRelatedSentence(authUser, isRootUser, 'last');
  return last;
};

const getNextRecord = async (
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

const getPreviousRecord = async (
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
  const recordDao = new RecordDao();
  const searchOptions: mongoose.FilterQuery<RecordModel> = {};

  if (!isRootUser) {
    searchOptions.checker = authUser.id;
  }

  const { docs, totalDocs } = await recordDao.findAll({
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

const createRecord = async () => {};

const submitRecord = async (
  userId: string,
  id: string,
  submitData: {
    original?: string;
  }
): Promise<SubmitRecordResponse> => {
  const recordDao = new RecordDao();
  const userDao = new UserDao();
  const historyDao = new HistoryDao();

  const record = await recordDao.findItem(id);
  const user = await userDao.findItem(userId);

  const {
    success,
    errors,
    allophoneContent,
    pronunciation,
  } = await allophoneService.getPronunciationAndAllophoneContent({
    text: submitData.original || record!.original,
    voice: record!.voice,
    dialect: record!.dialect,
  });

  if (!success) {
    return {
      success: false,
      errors: errors,
    };
  }

  const updated = await recordDao.updateItem(record!, {
    allophoneContent,
    pronunciation,
    original: submitData.original,
    status: SentenceStatus.SUBMITTED,
  });
  await historyDao.createItem({
    event: HistoryEvent.SUBMIT,
    entity: HistoryEntity.RECORD,
    user: user!,
    record: record,
  });

  return { success: true, record: updated };
};

const submitErrorRecord = async (
  userId: string,
  id: string,
  errorMessage: string
): Promise<SubmitErrorRecordResponse> => {
  const recordDao = new RecordDao();
  const userDao = new UserDao();
  const historyDao = new HistoryDao();

  const user = await userDao.findItem(userId);
  const record = await recordDao.findItem(id);

  const updated = await recordDao.updateItem(record!, {
    status: SentenceStatus.ERROR,
    errorMessage: errorMessage,
  });

  await historyDao.createItem({
    event: HistoryEvent.ERROR,
    entity: HistoryEntity.RECORD,
    sentence: updated,
    user: user!,
  });

  return { success: true, record: updated };
};

const assignRecords = async (
  userId: string,
  assignData: {
    ids?: string[];
    type?: SentenceType;
    count?: number;
    checker: string;
  }
): Promise<AssignRecordsResponse> => {
  if (!assignData.ids && (!assignData.type || !assignData.count)) {
    return {
      success: false,
      errors: [{ message: 'Invalid Assign args, please try again' }],
    };
  }

  const recordDao = new RecordDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);
  const checker = await userDao.findItem(assignData.checker);

  if (assignData.ids) {
    const assigned = await Promise.all(
      assignData.ids.map(async id => {
        const record = await recordDao.findItem(id);

        await recordDao.updateItem(record!, {
          status: SentenceStatus.ASSIGNED,
          checker: checker!,
        });
        await historyDao.createItem({
          event: HistoryEvent.ASSIGN,
          entity: HistoryEntity.RECORD,
          record: record,
          user: user!,
        });

        return record!;
      })
    );

    return { success: true, records: assigned };
  }

  const { totalDocs, docs } = await recordDao.findAll({
    needAll: true,
    paginateQuery: {},
    options: { checker: { $exists: false }, type: { $eq: assignData.type } },
  });
  const records = docs.slice(
    0,
    Math.min(assignData.count!, totalDocs)
  ) as RecordDoc[];

  const assigned = await Promise.all(
    records.map(async sentence => {
      await recordDao.updateItem(sentence!, {
        status: SentenceStatus.ASSIGNED,
        checker: checker!,
      });
      await historyDao.createItem({
        event: HistoryEvent.ASSIGN,
        entity: HistoryEntity.RECORD,
        sentence: sentence,
        user: user!,
      });

      return sentence!;
    })
  );

  return { success: true, records: assigned };
};

const approveRecords = async (
  userId: string,
  ids: string[]
): Promise<ApproveRecordsResponse> => {
  const recordDao = new RecordDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);

  const approved = await Promise.all(
    ids.map(async id => {
      const record = await recordDao.findItem(id);

      await recordDao.updateItem(record!, {
        status: SentenceStatus.APPROVED,
      });
      await historyDao.createItem({
        event: HistoryEvent.APPROVE,
        entity: HistoryEntity.SENTENCE,
        record: record,
        user: user!,
      });

      return record!;
    })
  );

  return { success: true, records: approved };
};

const deleteRecords = async (
  userId: string,
  ids: string[]
): Promise<DeleteRecordsResponse> => {
  const recordDao = new RecordDao();
  const historyDao = new HistoryDao();
  const userDao = new UserDao();

  const user = await userDao.findItem(userId);

  const deleted = await Promise.all(
    ids.map(async id => {
      const record = await recordDao.findItem(id);

      await recordDao.deleteItem(record!);
      await historyDao.createItem({
        event: HistoryEvent.DELETE,
        entity: HistoryEntity.RECORD,
        record: record,
        user: user!,
      });

      return record!;
    })
  );

  return { success: true, records: deleted };
};

const recordService = {
  getRecords,
  getRecord,
  getFirstRecord,
  getLastRecord,
  getNextRecord,
  getPreviousRecord,
  createRecord,
  submitRecord,
  submitErrorRecord,
  assignRecords,
  approveRecords,
  deleteRecords,
};

export { recordService };
