import { Logger } from "../common/logger/logger";
import { ServiceResponse } from "../models/service-response.model";

export class BaseController {
  constructor(protected logger: Logger) { }

  protected returnError<T>(error: Error): ServiceResponse<T> {
    return {
      status: 500,
      error: error,
    };
  }

  protected returnSuccess<T>(data: T): ServiceResponse<T> {
    return {
      data: data,
      status: 200,
    };
  }
}

