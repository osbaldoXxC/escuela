import mongoose from 'mongoose';
import User from './src/models/User.js';
import { MONGODB_URI } from './config.js';

async function insertSampleUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB')


    const users = [
      { username: 'osbaldo', password: 'password123' },
      { username: 'profesor1', password: 'profesor123' },
      { username: 'estudiante1', password: 'estudiante123' }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Usuario creado: ${user.username}`);
    }

    console.log('Todos los usuarios fueron insertados');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertSampleUsers();