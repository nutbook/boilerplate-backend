import { Inject, Service } from "typedi";
import { Logger } from "../common/logger/logger";
import { Item } from "../models/items/item.model";
import { PaginatedCollection } from "../models/paginated-collection.model";
import { FakeItemsRepo } from "../repository/fake-items.repo";

/**
 * Service Methods
 */
@Service()
export class ItemService {
  constructor(private itemsRepo: FakeItemsRepo, private logger: Logger) {}

  public async getAll(): Promise<PaginatedCollection<Item>> {
    this.logger.info("find all items");
    const items = await this.itemsRepo.getAll();
    return {
      items: items,

    };
  }

  public async getById(id: string): Promise<Item> {
    return this.itemsRepo.get(id);
  }

  public async add(newItem: Item): Promise<Item> {
    return this.itemsRepo.add(newItem);
  }

  public async update(id: string, updatedItem: Item): Promise<Item> {
    return this.itemsRepo.update(id, updatedItem);
  }
}
