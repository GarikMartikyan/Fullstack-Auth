import {userService} from "../service/user.service.js";
import {validationResult} from "express-validator";
import {ApiError as apiError} from "../exceptions/api-errors.js";
import {CLIENT_URL} from "../consts/consts.index.js";

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(apiError.BadRequest('Validation error', errors.array()))
            }
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.send(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            console.log('asdfghjkl')
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.send(userData)

        } catch (e) {
            next(e)

        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.send(token)

        } catch (e) {
            next(e)

        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            res.redirect(CLIENT_URL)

        } catch (e) {
            next(e)

        }
    }


    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.send(userData)

        } catch (e) {
            next(e)

        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            res.send(users)
        } catch (e) {
            next(e)

        }
    }

    async getMe(req, res, next) {
        try {
            const user = req.user
            const userData = await userService.getMe(user.id)
            res.send(userData)
        } catch (e) {
            next(e)
        }
    }
}

export const userController = new UserController()
