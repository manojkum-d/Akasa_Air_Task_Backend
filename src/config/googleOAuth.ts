import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const clientID = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const redirectUri = "http://localhost:3000/api/auth/google/callback";

const oauth2Client = new OAuth2Client(clientID, clientSecret, redirectUri);

export default oauth2Client;
