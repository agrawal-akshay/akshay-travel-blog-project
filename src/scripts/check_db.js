import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse .env.local
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
} catch (e) {
  console.warn(e);
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const posts = await db.collection('posts').find({}).limit(5).toArray();
    console.log('Posts:', JSON.stringify(posts, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
run();
