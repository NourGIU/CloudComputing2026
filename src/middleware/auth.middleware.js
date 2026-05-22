import { CognitoJwtVerifier } from "aws-jwt-verify";

let verifier = null;

// Cognito JWT verification is centralized here so every protected route uses
// the same trusted identity source instead of accepting user data from the UI.
const getVerifier = () => {
  if (verifier) {
    return verifier;
  }

  const { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, COGNITO_REGION } = process.env;

  if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID || !COGNITO_REGION) {
    return null;
  }

  verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USER_POOL_ID,
    tokenUse: "id",
    clientId: COGNITO_CLIENT_ID,
  });

  return verifier;
};

// Validates the Authorization Bearer token and exposes a normalized user object
// for controllers and authorization middleware.
export const authenticateCognitoToken = async (req, res, next) => {
  const cognitoVerifier = getVerifier();

  if (!cognitoVerifier) {
    return res.status(500).json({
      error: "Cognito authentication is not configured",
    });
  }

  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing Authorization Bearer token" });
  }

  try {
    const decoded = await cognitoVerifier.verify(token);
    const role = decoded["custom:role"] || null;
    const teamId = decoded["custom:teamId"] || null;

    if (!role || !teamId) {
      return res.status(403).json({
        error: "Authenticated user is missing role or teamId claims",
      });
    }

    req.user = {
      userId: decoded.sub,
      email: decoded.email || null,
      role,
      teamId,
    };

    console.log("Authenticated user:", req.user);

    return next();
  } catch (error) {
    console.error("Cognito token verification failed", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
