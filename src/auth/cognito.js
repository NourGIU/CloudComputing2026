import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from "amazon-cognito-identity-js";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

// Frontend Cognito config must use VITE_ keys because Vite only exposes those
// variables to browser code. Backend middleware still reads COGNITO_* keys.
if (!userPoolId || !clientId) {
  console.warn("Missing VITE_COGNITO_USER_POOL_ID or VITE_COGNITO_CLIENT_ID");
}

const userPool = new CognitoUserPool({
  UserPoolId: userPoolId || "missing-user-pool-id",
  ClientId: clientId || "missing-client-id",
  Storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
});

let pendingChallengeUser = null;

const toUser = (session) => {
  const idToken = session.getIdToken();
  const payload = idToken.decodePayload();

  return {
    token: idToken.getJwtToken(),
    userId: payload.sub,
    email: payload.email || null,
    name: payload.name || payload["cognito:username"] || payload.email || payload.sub,
    role: payload["custom:role"] || payload.role || null,
    teamId: payload["custom:teamId"] || payload.teamId || null,
  };
};

const getCognitoUser = (username) =>
  new CognitoUser({
    Username: username,
    Pool: userPool,
  });

export const loginWithCognito = (username, password) =>
  new Promise((resolve, reject) => {
    const cognitoUser = getCognitoUser(username);
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        pendingChallengeUser = null;
        resolve({ status: "SIGNED_IN", user: toUser(session) });
      },
      onFailure: reject,
      newPasswordRequired: () => {
        pendingChallengeUser = cognitoUser;

        resolve({
          status: "NEW_PASSWORD_REQUIRED",
        });
      },
    });
  });

export const completeNewPassword = (newPassword) =>
  new Promise((resolve, reject) => {
    if (!pendingChallengeUser) {
      reject(new Error("No pending new password challenge."));
      return;
    }

    // Do not send email, email_verified, custom:role, or custom:teamId here.
    // Those attributes were already provided on the Cognito user and are not
    // writable during the NEW_PASSWORD_REQUIRED response.
    pendingChallengeUser.completeNewPasswordChallenge(newPassword, {}, {
      onSuccess: (session) => {
        pendingChallengeUser = null;
        resolve(toUser(session));
      },
      onFailure: reject,
    });
  });

export const getCurrentCognitoSession = () =>
  new Promise((resolve) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }

    cognitoUser.getSession((error, session) => {
      if (error || !session?.isValid()) {
        resolve(null);
        return;
      }

      resolve(toUser(session));
    });
  });

export const logoutFromCognito = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
  pendingChallengeUser = null;
};
