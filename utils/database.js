import mongoose from 'mongoose';


const url = process.env.MONGODB_URL || 'mongodb+srv://praansh19:94mnQNqnQJXi7P7b@cluster0.cgu1gra.mongodb.net/';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const databaseConnection = async () => {
  try {
    await mongoose.connect(url, options);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};