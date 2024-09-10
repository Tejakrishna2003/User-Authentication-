import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Define Mongoose schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/authentication")
.then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// app.get('/login', function(req, res) {
//   res.render('login');
// });

// app.get('/signup', function(req, res) {
//   res.render('signup');
// });

// Signup route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Received signup request:', req.body);

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and include letters, numbers, and special symbols.' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Signup successful. Redirecting to login page...' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'user or email already exist' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Assuming you have a method to validate the password
    if (user.password === req.body.password) {
      res.status(200).json({ message: 'Login successful' });
      res.render('/home')
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
