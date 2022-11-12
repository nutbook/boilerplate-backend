import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  JsonController,
} from "routing-controllers";
import { Logger } from "../common/logger/logger";
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi'
import { Item } from "../models/items/item.model";
import { ServiceResponse } from "../models/service-response.model";
import { ItemService } from "../services/items.service";
import { BaseController } from "./base.controller";
import { ItemResponse } from "../models/items/item.response";
import { PaginatedCollection } from "../models/paginated-collection.model";

@JsonController("/items")
export class ItemsController extends BaseController {
  constructor(private itemService: ItemService, logger: Logger) {
    super(logger);
  }

  @Get()
  async getAll(): Promise<ServiceResponse<PaginatedCollection<Item>>> {
    try {
      const items = await this.itemService.getAll();
      return this.returnSuccess(items);
    } catch (error) {
      this.logger.error(error);
      return this.returnError(error);
    }
  }

  @Get("/:id")
  async getOne(@Param("id") id: string): Promise<ServiceResponse<Item>> {
    try {
      const item: Item = await this.itemService.getById(id);
      return this.returnSuccess(item);
    } catch (error) {
      this.logger.error(error);
      return this.returnError(error);
    }
  }

  @Post("/")
  @OpenAPI({ summary: 'Return a list of users' })
  @ResponseSchema(ItemResponse)
  async post(@Body() item: any): Promise<ServiceResponse<Item>> {
    try {
      const result = await this.itemService.add(item);
      return this.returnSuccess(item);
    } catch (error) {
      this.logger.error(error);
      return this.returnError(error);
    }
  }

  @Put("/:id")
  async put(
    @Param("id") id: string,
    @Body() item: any
  ): Promise<ServiceResponse<Item>> {
    try {
      const result = await this.itemService.update(id, item);
      return this.returnSuccess(item);
    } catch (error) {
      this.logger.error(error);
      return this.returnError(error);
    }
  }
}

