
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CustomGame from './pages/CustomGame';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/custom-game" element={<CustomGame />} />
      </Routes>
    </Router>
  );
};

export default App;
