import {ApiError} from "../exceptions/api-errors.js";
import chalk from "chalk";

export const errorMiddleware = (err, req, res, next) => {

    console.error(chalk.red(err))

    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }

    return res.status(500).json({message: err.message, errors: err.errors})
}
