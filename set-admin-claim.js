/*
 * Usage:
 *   node set-admin-claim.js admin@yensaocatan.com ./service-account.json
 * or
 *   setx GOOGLE_APPLICATION_CREDENTIALS "./service-account.json" && node set-admin-claim.js admin@yensaocatan.com
 *
 * Requires: npm install firebase-admin
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const email = process.argv[2];
const credentialsPath = process.argv[3] || process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';

if (!email) {
  console.error('Usage: node set-admin-claim.js <email> [service-account.json]');
  process.exit(1);
}

const resolvedPath = path.resolve(credentialsPath);
if (!fs.existsSync(resolvedPath)) {
  console.error('Service account file not found:', resolvedPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function main() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const existingClaims = user.customClaims || {};
    const updatedClaims = { ...existingClaims, admin: true };
    await admin.auth().setCustomUserClaims(user.uid, updatedClaims);
    console.log(`Custom claim admin:true set for ${email} (uid=${user.uid}).`);
  } catch (err) {
    console.error('Failed to set custom claim:', err);
    process.exit(1);
  }
}

main();
