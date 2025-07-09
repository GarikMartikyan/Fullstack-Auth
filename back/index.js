import express from 'express'
import cookieParser from 'cookie-parser'
import {connect} from "mongoose";
import {router} from "./router/index.router.js";
import {errorMiddleware} from "./middlewares/error.middleware.js";
import {CLIENT_URL, DB_URL, PORT} from "./consts/consts.index.js";
import cors from "cors";

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
}));
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    console.log(CLIENT_URL)
    try {
        await connect(DB_URL)
        app.listen(PORT, () => console.log(`DB connected, Server started on http://localhost:${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
