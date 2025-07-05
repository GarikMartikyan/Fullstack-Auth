import {createTransport} from "nodemailer";
import dotenv from "dotenv";
import {google} from "googleapis";

dotenv.config();

class MailService {
    #clientId;
    #clientSecret;
    #refreshToken;
    #redirectUri;
    #accessToken;
    #transporter;
    #oauth2Client;

    constructor() {
        this.#clientId = process.env.GOOGLE_CLIENT_ID;
        this.#clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        this.#refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        this.#redirectUri = process.env.GOOGLE_REDIRECT_URI;

        this.#oauth2Client = new google.auth.OAuth2(
            this.#clientId,
            this.#clientSecret,
            this.#redirectUri
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
                user: process.env.SMTP_EMAIL,
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
            from: process.env.SMTP_EMAIL,
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
