import {createTransport} from "nodemailer";
import {google} from "googleapis";
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, SMTP_EMAIL} from "../consts/consts.index.js";


class MailService {
    #clientId;
    #clientSecret;
    #refreshToken;
    #redirectUri;
    #accessToken;
    #transporter;
    #oauth2Client;

    constructor() {

        this.#oauth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI
        );
    }

    async #generateAccessToken() {
        this.#oauth2Client.setCredentials({
            refresh_token: this.#refreshToken
        });

        const accessTokenResponse = await this.#oauth2Client.getAccessToken();
        const token = accessTokenResponse?.token;

        if (!token) {
            throw new Error("Failed to retrieve access token");
        }

        this.#accessToken = token;
        return token;
    }

    async #createTransporter() {
        const accessToken = await this.#generateAccessToken();

        this.#transporter = createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: SMTP_EMAIL,
                clientId: this.#clientId,
                clientSecret: this.#clientSecret,
                refreshToken: this.#refreshToken,
                accessToken: accessToken
            }
        });

    }

    async sendActivationMail(to, link) {
        if (!this.#transporter) {
            await this.#createTransporter();
        }

        await this.#transporter.sendMail({
            from: SMTP_EMAIL,
            to,
            subject: "Account Activation",
            html: `
                <div>
                    <h1>Click here to activate your account</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        });

    }
}

export const mailService = new MailService();
