import { executionAsyncId } from "async_hooks";
import { BaseEntity } from "../models/entity-base.model";
import { Item } from "../models/items/item.model";
import { QueryParams } from "../models/query-params.model";
import { IStoreDb } from "./store-db.interface";

export class FakeItemsRepo {
  items: Item[] = [
    {
      id: "1",
      name: "Burger",
      price: 5.99,
      description: "Tasty",
      dtCreated: new Date("2020-01-01"),
      dtUpdated: new Date("2020-01-01"),
    },
    {
      id: "2",
      name: "Pizza",
      price: 2.99,
      description: "Cheesy",
      dtCreated: new Date("2020-01-01"),
      dtUpdated: new Date("2020-01-01"),
    },
    {
      id: "3",
      name: "Tea",
      price: 1.99,
      description: "Informative",
      dtCreated: new Date("2020-01-01"),
      dtUpdated: new Date("2020-01-01"),
    },
  ];

  async getAll(): Promise<Item[]> {
    return this.items;
  }

  async getMany(queryParam: QueryParams): Promise<Item[]> {
    return this.items;
  }

  async get(id: string): Promise<Item> {
    const item = this.items.find((i) => i.id === id);
    if (item) {
      return item;
    }
    throw new Error("Item not found");
  }

  async add(newItem: Item): Promise<Item> {
    const id = new Date().valueOf();
    this.items.push(newItem);
    return newItem;
  }

  async update<Item>(id: string, updatedItem: Item): Promise<Item> {
    let existingItem = this.items.find((i) => i.id === id);
    if (!existingItem) {
      throw new Error("");
    }
    if (existingItem) {
    }

    return updatedItem;
  }
}
