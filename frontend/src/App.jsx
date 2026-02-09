import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Component/Header/Header';
import Navbar from './Component/Navbar/Navbar';
import Homepage from './Pages/Homepage/Homepage';
import SignIn from './Pages/Homepage/Auth/SignIn';
import Register from './Pages/Homepage/Auth/Register';
import Dashboard from './Pages/Homepage/Dashboard/Dashboard';
import './App.css';
import './Pages/Homepage/Auth/Auth.css';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedMode, setSelectedMode] = useState('Academic'); // Add selectedMode state

  // Update activePage when mode changes
  useEffect(() => {
    // Set initial active page based on URL or default
    const path = window.location.pathname;
    if (path === '/Career' || path === '/career') {
      setSelectedMode('Career');
      setActivePage('career-home');
    } else {
      setSelectedMode('Academic');
      setActivePage('academic-home');
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <div className="main-container">
          <Navbar 
            activePage={activePage} 
            setActivePage={setActivePage}
            selectedMode={selectedMode}
            setSelectedMode={setSelectedMode}
          />
          <div className="content">
            <Routes>
              {/* Home routes for each mode */}
              <Route 
                path="/" 
                element={
                  <Homepage 
                    setActivePage={setActivePage} 
                    selectedMode={selectedMode}
                  />
                } 
              />
              <Route 
                path="/Academic" 
                element={
                  <Homepage 
                    setActivePage={setActivePage} 
                    selectedMode="Academic"
                  />
                } 
              />
              <Route 
                path="/Career" 
                element={
                  <Homepage 
                    setActivePage={setActivePage} 
                    selectedMode="Career"
                  />
                } 
              />
              
              {/* Auth routes */}
              <Route path="/signin" element={<SignIn setActivePage={setActivePage} />} />
              <Route path="/register" element={<Register setActivePage={setActivePage} />} />
              <Route path="/dashboard" element={<Dashboard setActivePage={setActivePage} />} />
              
              {/* Academic feature routes */}
              <Route path="/smart-notes" element={<div>Smart Notes Maker Page</div>} />
              <Route path="/assignment-helper" element={<div>Assignment Helper Page</div>} />
              <Route path="/exam-prep" element={<div>Exam Prep Buddy Page</div>} />
              <Route path="/doubt-solver" element={<div>Doubt Solver Page</div>} />
              <Route path="/study-scheduler" element={<div>Study Scheduler Page</div>} />
              <Route path="/progress-analytics" element={<div>Progress Analytics Page</div>} />
              
              {/* Career feature routes */}
              <Route path="/resume-analyzer" element={<div>Resume Analyzer Page</div>} />
              <Route path="/roadmap" element={<div>Career Roadmap Page</div>} />
              <Route path="/qa-assistant" element={<div>Q&A Assistant Page</div>} />
              <Route path="/interview-simulator" element={<div>Interview Simulator Page</div>} />
              <Route path="/coding-platforms" element={<div>Coding Platforms Page</div>} />
              <Route path="/portfolio-builder" element={<div>Portfolio Builder Page</div>} />
              
              {/* Common routes */}
              <Route path="/profile" element={<div>Profile Page</div>} />
              <Route path="/settings" element={<div>Settings Page</div>} />
              <Route path="/logout" element={<div>Logout Page</div>} />
              
              {/* Fallback route */}
              <Route path="*" element={
                <Homepage 
                  setActivePage={setActivePage} 
                  selectedMode={selectedMode}
                />
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;