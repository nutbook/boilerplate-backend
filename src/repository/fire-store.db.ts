import { nanoid } from "nanoid";
import { IStoreDb } from "./store-db.interface";
import { Firestore, WhereFilterOp } from "@google-cloud/firestore";
import { BaseEntity } from "../models/entity-base.model";
import { QueryParams } from "../models/query-params.model";

export class FireStoreDbConnection {
  public connection: Firestore;

  constructor(projectId: string, keyFileWithPath: string) {
    this.connection = new Firestore({
      projectId: projectId,
      keyFilename: keyFileWithPath,
    });
  }
}

export class FireStoreDb implements IStoreDb {
  constructor(
    private storeDbConnection: FireStoreDbConnection,
    private collection: string
  ) {}

  public async get<T extends BaseEntity>(id: string): Promise<T> {
    const EventLogs = this.storeDbConnection.connection
      .collection(this.collection)
      .doc(id);
    const doc = await EventLogs.get();
    return doc.data() as T;
  }

  public async getMany<T extends BaseEntity>(
    queryParam: QueryParams
  ): Promise<T[]> {
    const documents: T[] = [];
    const documentCollection = this.storeDbConnection.connection.collection(
      this.collection
    );

    const querySnapshot = await documentCollection
      .where(
        queryParam.fieldPath,
        queryParam.operator as WhereFilterOp,
        queryParam.fieldValue
      )
      .get();

    querySnapshot.forEach((documentSnapshot) => {
      documents.push(documentSnapshot.data() as T);
    });

    return documents;
  }

  public async getAll<T extends BaseEntity>(): Promise<T[]> {
    const documents: T[] = [];
    const documentCollection = this.storeDbConnection.connection.collection(
      this.collection
    );
    const snapshot = await documentCollection.get();
    snapshot.forEach((doc: any) => {
      console.log(doc.id, "=>", doc.data());
      documents.push(doc.data() as T);
    });
    console.log("documents : ", documents);
    return documents;
  }

  public async add<T extends BaseEntity>(newItem: T): Promise<T> {
    try {
      const newDocId = nanoid(10);
      const currentDate = new Date().toISOString();
      newItem.id = newDocId;
      newItem.dtCreated = new Date(currentDate);
      newItem.dtUpdated = new Date(currentDate);
      const result = await this.storeDbConnection.connection
        .collection(this.collection)
        .doc(newDocId)
        .set(JSON.parse(JSON.stringify(newItem)));
      return this.get(newDocId);
    } catch (error) {
      throw error;
    }
  }

  public async update<T extends BaseEntity>(
    id: string,
    updatedItem: T
  ): Promise<any> {
    const currentDate = new Date().toISOString();
    updatedItem.dtUpdated = new Date(currentDate);
    const eventLogs = await this.storeDbConnection.connection
      .collection(this.collection)
      .doc(id);

    const res = await eventLogs.update(JSON.parse(JSON.stringify(updatedItem)));
    return this.get(id);
  }
}
