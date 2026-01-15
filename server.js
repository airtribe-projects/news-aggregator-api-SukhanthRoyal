require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 3000;

(async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } else {
      console.log('MONGODB_URI not set; running without DB');
    }
    app.listen(port, () => console.log(`Server is listening on ${port}`));
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
})();