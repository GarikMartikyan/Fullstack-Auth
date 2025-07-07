import {PORT} from "../consts/consts.index.js";

export const getActivationLink = (activationLink) => {
    return `http://localhost:${PORT}/api/activate/${activationLink}`
}
