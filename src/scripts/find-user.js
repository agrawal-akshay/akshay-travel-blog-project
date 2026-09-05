import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let uri = 'mongodb://localhost:27017/travilever_blog';
try {
  const envPath = path.join(__dirname, '../../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^MONGODB_URI=["']?([^"\n\r']+)["']?/m);
    if (match && match[1]) {
      uri = match[1];
    }
  }
} catch (e) {}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const usersCollection = db.collection('users');

  const user = await usersCollection.findOne({ email: 'akshay@cantilever' });
  console.log('USER DETECTED IN DB:');
  console.log(JSON.stringify(user, null, 2));

  // Let's print all admins for reference
  const admins = await usersCollection.find({ role: 'admin' }).toArray();
  console.log('ALL ADMINS IN DB:');
  console.log(JSON.stringify(admins, null, 2));

  await client.close();
}

main().catch(console.error);
