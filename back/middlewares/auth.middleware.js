import {ApiError} from "../exceptions/api-errors.js";
import {tokenService} from "../service/token.service.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) {
            next(ApiError.UnauthorizedError())
        }

        const accessToken = authorizationHeader?.split(' ')?.[1]
        if (!accessToken) {
            next(ApiError.UnauthorizedError())
        }
        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData) {
            next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()
    } catch (e) {
        next(ApiError.UnauthorizedError())
    }
}
