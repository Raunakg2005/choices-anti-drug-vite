import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChildhoodGame from './pages/MainGame/Childhood/ChildhoodGame';
import TeenageNegative from './pages/MainGame/Teenage/TeenageNegative';
import TeenagePositive from './pages/MainGame/Teenage/TeenagePositive';
import AdultNegative from './pages/MainGame/Adult/AdultNegative';
import AdultPositive from './pages/MainGame/Adult/AdultPositive';
import OldNegative from './pages/MainGame/Old/OldNegative';
import OldPositive from './pages/MainGame/Old/OldPositive';
import EndingNegative from './pages/MainGame/Ending/EndingNegative';
import EndingPositive from './pages/MainGame/Ending/EndingPositive';
import DynamicGame from './pages/DynamicGame/DynamicGame';
import Forum from './pages/Forum/Forum';
import PledgeCertificate from './pages/PledgeCertificate/PledgeCertificate';
import ProjectFeedback from './pages/ProjectFeedback/ProjectFeedback';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main-game/childhood" element={<ChildhoodGame />} />
          <Route path="/main-game/teenage/negative" element={<TeenageNegative />} />
          <Route path="/main-game/teenage/positive" element={<TeenagePositive />} />
          <Route path="/main-game/adult/negative" element={<AdultNegative />} />
          <Route path="/main-game/adult/positive" element={<AdultPositive />} />
          <Route path="/main-game/old/negative" element={<OldNegative />} />
          <Route path="/main-game/old/positive" element={<OldPositive />} />
          <Route path="/main-game/ending/negative" element={<EndingNegative />} />
          <Route path="/main-game/ending/positive" element={<EndingPositive />} />
          <Route path="/dynamic-game" element={<DynamicGame />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/pledge-certificate" element={<PledgeCertificate />} />
          {/* Legacy path from the original static site - accept both spellings */}
          <Route path="/Pledge-Ceartificate" element={<PledgeCertificate />} />
          <Route path="/project-feedback" element={<ProjectFeedback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
