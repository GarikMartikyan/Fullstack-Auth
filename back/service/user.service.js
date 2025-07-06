import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";
import {v4} from "uuid";
import {mailService} from "./mail.service.js";
import {tokenService} from "./token.service.js";
import {UserDto} from "../dtos/suer.dto.js";
import {ApiError} from "../exceptions/api-errors.js";
import {PORT} from "../consts/consts.index.js";


class UserService {

    async registration(email, password) {
        const candidate = await User.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = v4()

        await mailService.sendActivationMail(email, `http://localhost:${PORT}/api/activate/${activationLink}`)
        const user = await User.create({email, password: hashPassword, activationLink})


        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)


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
            throw ApiError.BadRequest('User not found')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password')
        }
        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = await tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if (!tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

}

export const userService = new UserService()
