import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Simulated OAuth2 server details
const OAUTH_SERVER_URL = "https://dummy-oauth-server.com";
const CLIENT_ID = process.env.CLIENT_ID || "test-client";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "test-secret";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Simulated OAuth2 Strategy
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: `${OAUTH_SERVER_URL}/authorize`,
      tokenURL: `${OAUTH_SERVER_URL}/token`,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "/auth/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Middleware to validate JWT access tokens
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
}

// Simulated token issuance (for testing)
export function issueToken(req, res) {
  const user = { id: "123", role: "admin" };
  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
  res.json({ accessToken });
}
