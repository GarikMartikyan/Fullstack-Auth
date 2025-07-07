import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";
import {v4} from "uuid";
import {mailService} from "./mail.service.js";
import {tokenService} from "./token.service.js";
import {UserDto} from "../dtos/suer.dto.js";
import {ApiError} from "../exceptions/api-errors.js";
import {getActivationLink} from "../helpers/index.helpers.js";


class UserService {

    async registration(email, password) {
        const candidate = await User.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const linkPattern = v4()
        const activationLink = getActivationLink(linkPattern)

        await mailService.sendActivationMail(email, activationLink)
        const user = await User.create({email, password: hashPassword, activationLink})

        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken)


        return {
            ...tokens,
            user: userDto
        }

    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Invalid activation link')
        }
        user.isActivated = true
        await user.save()

    }

    async login(email, password) {
        const user = await User.findOne({email})
        if (!user) {
            throw ApiError.BadRequest(`User with email ${email} not found`)
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password')
        }
        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeRefreshToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto})
        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await User.find()
        return users
    }

    async getMe(userId) {
        return await User.findById(userId)
    }

}

export const userService = new UserService()
