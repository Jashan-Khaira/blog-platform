import React from 'react';
import BlogList from './components/BlogList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Blog Platform</h1>
      </header>
      <main>
        <BlogList />
      </main>
    </div>
  );
}

export default App;
