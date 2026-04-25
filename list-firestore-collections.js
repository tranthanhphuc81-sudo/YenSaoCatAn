const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = JSON.parse(fs.readFileSync('service-account.json','utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

(async () => {
  try {
    const collections = await db.listCollections();
    console.log('Collections:');
    for (const col of collections) {
      const snap = await col.limit(1).get();
      console.log('-', col.id, 'documents=', snap.size);
    }
  } catch (err) {
    console.error('Error listing collections:', err);
    process.exit(1);
  }
})();
