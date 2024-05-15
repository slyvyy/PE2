app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if username is already taken
        if (users.some(user => user.username === username)) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is a good work factor

        // Store the user (replace with your actual database storage logic)
        users.push({ username, password: hashedPassword });

        res.json({ success: true, message: 'Registration successful!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
