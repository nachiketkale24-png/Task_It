const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_PATH is not configured");
}

const serviceAccount = require(path.resolve(serviceAccountPath));

const app = initializeApp({
    credential: cert(serviceAccount),
});

const auth = getAuth(app);

module.exports = {
    auth,
};