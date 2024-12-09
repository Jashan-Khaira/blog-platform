const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Routes
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
