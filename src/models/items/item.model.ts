import { BaseEntity } from "../entity-base.model";

export class Item extends BaseEntity {
  name: string;
  price: number;
  description: string;
}
