const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const defaultCollections = ['products', 'stockMovements', 'reportBackups'];
const collections = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultCollections;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './service-account.json';

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, answer => {
    rl.close();
    resolve(answer.trim());
  }));
}

function validateCredentials(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`Service account file not found: ${resolved}`);
    process.exit(1);
  }
  return resolved;
}

async function deleteCollection(db, collectionPath, batchSize = 500) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.limit(batchSize);

  let deleted = 0;
  while (true) {
    const snapshot = await query.get();
    if (snapshot.empty) break;

    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    deleted += snapshot.size;
    console.log(`  Deleted ${snapshot.size} documents from ${collectionPath}...`);
    if (snapshot.size < batchSize) break;
  }

  return deleted;
}

async function main() {
  const serviceAccountPath = validateCredentials(credentialsPath);
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  console.log('Firebase project from service account:', serviceAccount.project_id || '<unknown>');
  console.log('Collections to delete:', collections.join(', '));
  const answer = await ask('Are you sure you want to delete these collections? Type YES to continue: ');
  if (answer !== 'YES') {
    console.log('Aborted. No data has been deleted.');
    process.exit(0);
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const db = admin.firestore();

  for (const collectionPath of collections) {
    console.log(`Deleting collection: ${collectionPath}`);
    const deleted = await deleteCollection(db, collectionPath);
    console.log(`Finished deleting ${deleted} documents from ${collectionPath}.`);
  }

  console.log('Done. Selected collections have been cleared.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error deleting collections:', err);
  process.exit(1);
});
