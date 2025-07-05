import {User} from "../models/user.model.js";
import bcrypt from "bcrypt";
import {v4} from "uuid";
import {mailService} from "./mail.service.js";
import {tokenService} from "./token.service.js";
import {UserDto} from "../dtos/suer.dto.js";
import dotenv from "dotenv";

dotenv.config()

class UserService {

    async registration(email, password) {
        const candidate = await User.findOne({email})
        if (candidate) {
            throw new Error('User already exists')
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = v4()

        await mailService.sendActivationMail(email, `http://localhost:${process.env.PORT}/api/activate/${activationLink}`)
        const user = await User.create({email, password: hashPassword, activationLink})


        const userDto = new UserDto(user)
        const tokens = await tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        console.log("User created")

        return {
            ...tokens,
            user: userDto
        }

    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if (!user) {
            throw new Error('User not found')
        }
        user.isActivated = true
        await user.save()

    }
}

export const userService = new UserService()
