import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse .env.local manually
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
  console.warn('Could not parse .env.local, using default local URI.');
}

async function seedUser() {
  console.log(`Connecting to MongoDB at: ${uri}`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('users');

    // Clear existing users
    await usersCollection.deleteMany({});

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = {
      username: 'admin',
      email: 'admin@travilever.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(adminUser);
    console.log(`Successfully created admin user with ID: ${result.insertedId}`);
    console.log(`Email: admin@travilever.com`);
    console.log(`Password: admin123`);
  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    await client.close();
  }
}

seedUser();
