import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 3000
export const DB_URL = process.env.DB_URL
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
export const SMTP_EMAIL = process.env.SMTP_EMAIL
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
export const CLIENT_URL = process.env.CLIENT_URL
