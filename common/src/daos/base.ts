import mongoose, { FilterQuery } from 'mongoose';

import { Resource } from '../types/resource';
import { isEmpty } from '../utils/helper';
import { PaginateResponse, PaginateQuery } from '../types/paginate';

export abstract class BaseDao<
  T extends mongoose.Document,
  U extends mongoose.Model<T>,
  V
> {
  resource?: Resource;
  abstract model: U;
  abstract populate: string[];

  abstract createItem(data: V): Promise<T>;
  abstract updateItem(item: T, data: V): Promise<T | null>;
  abstract deleteItem(item: T): Promise<T | null>;

  async findAll({
    paginateQuery,
    options = {},
    sort,
    needAll = false,
  }: {
    paginateQuery: PaginateQuery;
    options?: mongoose.FilterQuery<T>;
    sort?: any;
    needAll?: boolean;
  }): Promise<PaginateResponse> {
    const { search = '', page = 0, limit = 10 } = paginateQuery;
    let docs = [];

    if (search && !isEmpty(search)) {
      docs = await this.model
        // @ts-ignore
        .fuzzySearch(search, options)
        .populate(this.populate);
    } else {
      docs = await this.model.find(options).sort(sort).populate(this.populate);
    }
    const paginated = this.paginate({ page, limit, docs }, needAll);

    return {
      totalDocs: paginated.totalDocs,
      totalPages: paginated.totalPages,
      page: paginated.page,
      limit: paginated.limit,
      docs: paginated.docs,
    };
  }

  async findItem(
    condition: string | mongoose.FilterQuery<T>
  ): Promise<T | null> {
    if (
      typeof condition === 'string' &&
      mongoose.Types.ObjectId.isValid(condition)
    ) {
      const doc = await this.model.findById(condition).populate(this.populate);
      return doc;
    }

    if (typeof condition === 'object' && condition !== null) {
      const doc = await this.model.findOne(condition).populate(this.populate);
      return doc;
    }

    return null;
  }

  paginate = (
    args: {
      page: number;
      limit: number;
      docs: any[];
    },
    needAll?: boolean
  ): PaginateResponse => {
    const totalDocs = args.docs.length;
    const page = needAll ? 0 : args.page;
    const limit = needAll ? args.docs.length : args.limit;

    const start = page * limit;
    const end = (page + 1) * limit;
    const totalPages = Math.ceil(totalDocs / limit);

    const docsResult = args.docs.slice(start, end);

    return {
      totalDocs,
      totalPages,
      page,
      limit,
      docs: docsResult,
    };
  };

  async deleteManyItem(condition: FilterQuery<T>) {
    const deletedItems = await this.model.deleteMany(condition);

    return deletedItems;
  }
}
