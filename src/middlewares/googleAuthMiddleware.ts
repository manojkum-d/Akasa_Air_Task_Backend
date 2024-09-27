import { Request, Response, NextFunction } from "express";
import oauth2Client from "../config/googleOAuth.js";

// Middleware to redirect user to Google login page
export const googleLogin = (req: Request, res: Response) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  // Generate an OAuth URL and redirect the user to Google's consent page
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.redirect(url);
};

// Middleware to handle the Google OAuth callback
export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("No code found in query parameters.");
    }

    // Get the access token and ID token from Google using the authorization code
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Get the user's profile information from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token || "",
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (payload) {
      const user = {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      // You can create or update the user in your database here

      // For demonstration, we'll return the user details and tokens
      return res.status(200).json({
        message: "Google authentication successful",
        user,
        tokens,
      });
    } else {
      return res.status(400).send("Failed to get user profile from Google.");
    }
  } catch (error) {
    next(error);
  }
};
