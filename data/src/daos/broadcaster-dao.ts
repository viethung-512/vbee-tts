import {
  BaseDao,
  PaginateQuery,
  PaginateResponse,
  SentenceStatus,
} from '@tts-dev/common';
import {
  Broadcaster,
  BroadcasterAttrs,
  BroadcasterDoc,
  BroadcasterModel,
} from '../models/broadcaster';
import { SentenceDoc } from '../models/sentence';
import { SentenceDao } from './sentence-dao';

export class BroadcasterDao extends BaseDao<
  BroadcasterDoc,
  BroadcasterModel,
  BroadcasterAttrs
> {
  model = Broadcaster;
  populate = [];

  async createItem(data: BroadcasterAttrs) {
    const broadcaster = await Broadcaster.build({
      types: data.types,
      user: data.user,
      voice: data.voice,
      dialect: data.dialect,
      expiredAt: data.expiredAt,
      completed: data.completed,
    });
    await broadcaster.save();

    return broadcaster;
  }

  async updateItem(
    broadcaster: BroadcasterDoc,
    data: Partial<BroadcasterAttrs>
  ) {
    broadcaster.types = data.types || broadcaster.types;
    broadcaster.user = data.user || broadcaster.user;
    broadcaster.voice = data.voice || broadcaster.voice;
    broadcaster.dialect = data.dialect || broadcaster.dialect;
    broadcaster.expiredAt = data.expiredAt || broadcaster.expiredAt;

    await broadcaster.save();

    return broadcaster;
  }

  async deleteItem(broadcaster: BroadcasterDoc) {
    const deleted = await Broadcaster.findByIdAndDelete(broadcaster.id);

    return deleted;
  }

  async findBroadcasterSentences(
    query: PaginateQuery
  ): Promise<PaginateResponse> {
    const sentenceDao = new SentenceDao();

    const paginated = await sentenceDao.findAll({
      paginateQuery: query,
      needAll: true,
      options: { status: SentenceStatus.APPROVED },
    });

    return paginated;
  }
}
