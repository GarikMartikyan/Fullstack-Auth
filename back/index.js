import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {connect} from "mongoose";
import {router} from "./router/router.index.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import {DB_URL, PORT} from "./consts/consts.index.js";


const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await connect(DB_URL)
        app.listen(PORT, () => console.log(`DB connected, Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

