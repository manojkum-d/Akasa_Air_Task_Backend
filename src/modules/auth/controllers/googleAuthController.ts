import { Request, Response, NextFunction } from "express";
import oauth2Client from "../../../config/googleOAuth.js";
import jwt from "jsonwebtoken";

// Redirect to Google login
export const googleLogin = (req: Request, res: Response): void => {
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

// Handle Google OAuth callback
export const googleAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.query;

    if (!code) {
      res.status(400).send("No code found in query parameters.");
      return;
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

      // Generate a JWT token with user info
      const token = jwt.sign(
        { id: user.googleId, email: user.email },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );

      // Return the user details and tokens in the response
      res.status(200).json({
        message: "Google authentication successful",
        user,
        token,
      });
      return;
    } else {
      res.status(400).send("Failed to get user profile from Google.");
      return;
    }
  } catch (error) {
    next(error);
  }
};

// Get the Google authenticated user's profile (Protected Route)
export const getGoogleUserProfile = (req: Request, res: Response): void => {
  try {
    // Get the authenticated user from the request (set by `authenticateToken` middleware)
    const user = req.user;

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Return the user profile
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};
