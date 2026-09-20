const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // Local development
    serviceAccount = require(
        path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
    );
} else {
    // Render / production
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
}

const app = initializeApp({
    credential: cert(serviceAccount),
});

const auth = getAuth(app);

module.exports = {
    auth,
};