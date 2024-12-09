const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

// Database configuration with retries and timeout
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  retryDelay: 2000,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Test database connection before starting server
async function testDbConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    client.release();
    return true;
  } catch (err) {
    console.error('Database connection error:', err);
    return false;
  }
}

// CORS configuration
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

// Simple health check endpoint without DB check for container health checks
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', message: 'Server is running' });
});

// Detailed health check endpoint
app.get('/api/health/detailed', async (req, res) => {
  try {
    const dbHealthy = await testDbConnection();
    if (!dbHealthy) {
      return res.status(500).json({ 
        status: 'unhealthy', 
        message: 'Database connection failed',
        timestamp: new Date().toISOString()
      });
    }
    res.status(200).json({ 
      status: 'healthy', 
      message: 'All systems operational',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy', 
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a new post
app.post('/api/posts', async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update a post
app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      'UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server only after testing database connection
async function startServer() {
  try {
    console.log('Starting server initialization...');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });

    // Test database connection after server is running
    const dbHealthy = await testDbConnection();
    if (!dbHealthy) {
      console.error('Could not establish database connection. Server will continue running but database operations will fail.');
    }
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.');
  await pool.end();
  process.exit(0);
});

startServer();
