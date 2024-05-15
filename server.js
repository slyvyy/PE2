const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // Assuming you have a User model
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/Cluster63462', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'Tm5baFRvT0N2', { expiresIn: '1h' });

        res.json({ success: true, message: 'Login successful!', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
