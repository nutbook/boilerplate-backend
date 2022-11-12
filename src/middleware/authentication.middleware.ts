import { nanoid } from "nanoid";
import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { setFlagsFromString } from "v8";
import * as jwt from "jsonwebtoken";
import * as config from "../../src/keyFile.json";
import * as lang from "../lang/en.json";
import { UserAuthModel } from "../models/authentication/user-auth.model";
import { UserAuthRepo } from "../repository/authentication/user-auth.repo";





@Middleware({ type: "before" })

export class AuthenticationMiddleware implements ExpressMiddlewareInterface {

    constructor(
        private UserAuthModel: UserAuthModel,
        private UserAuthRepo: UserAuthRepo,

    ) { }

    async use(request: any, response: any, next?: (err?: any) => any): Promise<any> {

        const { authorization } = request.headers;

        if (authorization === undefined) {
            return response.json(lang.error.tokenerror);
        }
        else {
            try {
                const decoded = jwt.verify(authorization, config.jwtwebtoken);
                const result = await this.findIfTokenExist(authorization, decoded);
                
                if (result && result.length) {
                    if (next) {
                        next();
                    }
                }
                else {
                    return response.json(lang.error.tokeninvalid);
                }

            }
            catch (err) {
                this.deleteExpiredToken(authorization);
                return response.json(lang.error.tokeninvalid);
            }
        }
    }

    public async findIfTokenExist(
        ...params: any
    ): Promise<UserAuthModel[] | undefined> {
        return this.UserAuthRepo.findToken(params);
    }

    public async deleteExpiredToken(
        ...params: any
    ): Promise<UserAuthModel[] | undefined> {
        return this.UserAuthRepo.deleteToken(params);
    }
}