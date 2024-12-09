import React, { useState, useEffect } from 'react';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts');
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="blog-list">
      <h2>Blog Posts</h2>
      {posts.map((post) => (
        <div key={post.id} className="blog-post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
