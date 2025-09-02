import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect( 
      process.env.MONGODB_URI,      // 👉 development ke liye local UR
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 🔴 Agar connection me koi dikkat aayi to ye listener trigger hoga
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    // ⚠️ Kabhi connection cut/disconnect ho gaya to ye pata chalega
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // 🧹 App band hone par (Ctrl+C), MongoDB ka connection cleanly close hoga
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    // ❌ Initial connection fail hua to app band ho jaayega
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
