import { BaseEntity } from "../models/entity-base.model";
import { QueryParams } from "../models/query-params.model";

export interface IStoreDb {
    //getAll
  getAll<T extends BaseEntity>(): Promise<T[]>;
  //getmany
  getMany<T extends BaseEntity>(queryParam: QueryParams): Promise<T[]>;
  //get
  get<T extends BaseEntity>(id: string): Promise<T>;
  //create
  add<T extends BaseEntity>(newItem: T): Promise<T>;
  //updates
  update<T extends BaseEntity>(id: string, updatedItem: T): Promise<T>;
}
