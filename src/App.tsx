import React from 'react';
import logo from './logo.svg';
import './App.css';
import MyPlugin from './components/MyPlugin';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <MyPlugin
          title="Welcome to My Plugin"
          description="This is a beautiful component built with React and Tailwind CSS."
          onClick={() => { }}
        />
      </header>
    </div>
  );
}

export default App;
