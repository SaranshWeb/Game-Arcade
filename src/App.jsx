
import React from 'react';
import LandingPage from './Components/LandingPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <LandingPage />
    </div>
  );
}

export default App;





// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import LandingPage from './Components/LandingPage';
// import GamePage from './Components/GamePage'; // New: placeholder for individual game
// import HighScoresPage from './Components/HighScoresPage'; // New: high score view
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/game/:title" element={<GamePage />} />
//         <Route path="/high-scores" element={<HighScoresPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
