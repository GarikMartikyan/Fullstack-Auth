import {userService} from "../service/user.service.js";

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            res.send(userData)
        } catch (e) {
            console.log(e);
            res.status(400).send(e.message)
        }
    }

    async login(req, res, next) {
        try {

        } catch (e) {
            console.log(e);
            res.status(400).send(e.message)
        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {
            console.log(e);
            res.status(400).send(e.message)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            res.redirect(process.env.CLIENT_URL)

        } catch (e) {
            console.log(e);
            res.status(400).send(e.message)
        }
    }


    async refresh(req, res, next) {
        try {

        } catch (e) {

        }
    }

    async getUsers(req, res, next) {
        try {
            console.log('asdfghjkl')
            res.send([123])
        } catch (e) {

        }
    }
}

export const userController = new UserController()
