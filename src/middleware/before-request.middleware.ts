import { nanoid } from "nanoid";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";

const X_CORRELATION_ID = "x-correlation-id";
@Middleware({ type: "before" })
export class BeforeRequestMiddleware implements ExpressMiddlewareInterface {
  // interface implementation is optional

  use(request: any, response: any, next?: (err?: any) => any): any {
    if (!request.headers[X_CORRELATION_ID]) {
      request.headers[X_CORRELATION_ID] = nanoid();
    }

    if (next) {
      next();
    }
  }
}
