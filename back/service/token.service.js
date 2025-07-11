import jwt from "jsonwebtoken";
import {Token} from "../models/token.model.js";
import {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} from "../consts/consts.index.js";

class TokenService {

    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken

        }
    }

    async saveRefreshToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        return await Token.create({user: userId, refreshToken})

    }

    async removeRefreshToken(refreshToken) {
        const tokenData = await Token.deleteOne({refreshToken})
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({refreshToken})
        return tokenData
    }


}

export const tokenService = new TokenService()
