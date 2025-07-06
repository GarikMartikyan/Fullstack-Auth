import jwt from "jsonwebtoken";
import {Token} from "../models/token.model.js";

class TokenService {

    async generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken

        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        return await Token.create({user: userId, refreshToken})

    }

    async removeToken(refreshToken) {
        const tokenData = await Token.deleteOne({refreshToken})
        return tokenData
    }

    async validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }


}

export const tokenService = new TokenService()
