import cron from 'node-cron';
import Cart from '@/models/cartModel'; // Adjust the path according to your project structure
import { connect } from '@/dbConfig/dbConfig'; // Ensure you have the correct path for your database config

// Connect to the database
connect();

// Define the cleanup logic for expired guest carts
const cleanupExpiredCarts = async () => {
  try {
    const expirationDate = new Date(Date.now() - 60 * 60 * 24 * 7 * 1000); // 7 days ago
    const result = await Cart.deleteMany({ createdAt: { $lt: expirationDate }, userId: null });
    console.log(`Expired guest carts cleaned up: ${result.deletedCount} carts removed`);
  } catch (error) {
    console.error('Error during cleanup of expired carts:', error);
  }
};

// Schedule the cleanup job to run every day at midnight
cron.schedule('0 0 * * *', cleanupExpiredCarts, {
  timezone: 'UTC', // Set to your desired timezone
  scheduled: true,
});

console.log('Cart cleanup job scheduled to run every day at midnight');
