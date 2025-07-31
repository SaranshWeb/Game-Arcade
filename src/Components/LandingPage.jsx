// import React, { useState, useEffect } from 'react';
// import { Play, Trophy, Users, Star, Gamepad2, Zap } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';


// const GameCard = ({ title, description, players, difficulty, color, icon: Icon, onPlay }) => {
//   const [isHovered, setIsHovered] = useState(false);
  
//   return (
//     <div 
//       className={`game-card ${isHovered ? 'hovered' : ''}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{ '--card-color': color }}
//     >
//       <div className="game-card-inner">
//         <div className="game-card-bg"></div>
        
//         <div className="game-card-content">
//           <div className="game-icon">
//             <Icon size={32} />
//           </div>
          
//           <h3 className="game-title">{title}</h3>
//           <p className="game-description">{description}</p>
          
//           <div className="game-info">
//             <div className="player-count">
//               <Users size={16} />
//               <span>{players}</span>
//             </div>
//             <div className="difficulty">
//               {[...Array(5)].map((_, i) => (
//                 <Star 
//                   key={i} 
//                   size={16} 
//                   className={i < difficulty ? 'star-filled' : 'star-empty'} 
//                 />
//               ))}
//             </div>
//           </div>
          
//           <button className="play-button" onClick={() => onPlay(title)}>
//             <Play size={16} />
//             <span>Play Now</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const FloatingParticle = ({ delay, duration }) => {
//   return (
//     <div 
//       className="floating-particle"
//       style={{
//         left: `${Math.random() * 100}%`,
//         top: `${Math.random() * 100}%`,
//         animationDelay: `${delay}s`,
//         animationDuration: `${duration}s`
//       }}
//     ></div>
//   );
// };

// const LandingPage = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
  
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const handlePlayGame = (gameName) => {
//     console.log(`Starting game: ${gameName}`);
//     // Add your game routing logic here
//     alert(`Starting ${gameName}! Add your routing logic here.`);
//   };

//   const games = [
//     {
//       title: "Neon Runner",
//       description: "Fast-paced endless runner through cyberpunk cityscapes",
//       players: "1 Player",
//       difficulty: 3,
//       color: "#06b6d4",
//       icon: Zap
//     },
//     {
//       title: "Space Invaders Redux",
//       description: "Classic arcade shooter with modern twists and power-ups",
//       players: "1-2 Players",
//       difficulty: 2,
//       color: "#10b981",
//       icon: Gamepad2
//     },
//     {
//       title: "Puzzle Matrix",
//       description: "Mind-bending puzzle game that challenges your logic",
//       players: "1 Player",
//       difficulty: 4,
//       color: "#8b5cf6",
//       icon: Star
//     },
//     {
//       title: "Battle Arena",
//       description: "Multiplayer combat arena with various weapons and maps",
//       players: "2-4 Players",
//       difficulty: 3,
//       color: "#ef4444",
//       icon: Trophy
//     },
//     {
//       title: "Retro Racer",
//       description: "High-speed racing through neon-lit tracks",
//       players: "1-4 Players",
//       difficulty: 2,
//       color: "#f59e0b",
//       icon: Zap
//     },
//     {
//       title: "Code Breaker",
//       description: "Hacking simulation with real programming challenges",
//       players: "1 Player",
//       difficulty: 5,
//       color: "#6366f1",
//       icon: Star
//     }
//   ];

//   return (
//     <div className="landing-page">
//       {/* Background Elements */}
//       <div className="background-gradient"></div>
//       <div className="grid-overlay"></div>
      
//       {/* Floating Particles */}
//       {[...Array(20)].map((_, i) => (
//         <FloatingParticle 
//           key={i} 
//           delay={i * 0.2} 
//           duration={3 + Math.random() * 2}
//         />
//       ))}

//       {/* Header */}
//       <header className="header">
//         <div className="header-content">
//           <div className="logo-section">
//             <div className="logo-icon">
//               <Gamepad2 size={24} />
//             </div>
//             <div className="logo-text">
//               <h1 className="logo-title">ARCADE ZONE</h1>
//               <p className="logo-subtitle">Ultimate Gaming Experience</p>
//             </div>
//           </div>
          
//           <div className="header-info">
//             <div className="time-display">
//               <p className="time-label">Current Time</p>
//               <p className="time-value">
//                 {currentTime.toLocaleTimeString()}
//               </p>
//             </div>
//             <div className="header-divider"></div>
//             <button className="high-scores-btn">High Scores</button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="main-content">
//         {/* Hero Section */}
//         <section className="hero-section">
//           <h2 className="hero-title">GAME ON</h2>
//           <p className="hero-description">
//             Enter the ultimate arcade experience where classic games meet cutting-edge graphics. 
//             Choose your adventure and compete for the highest scores!
//           </p>
          
//           <div className="feature-badges">
//             <div className="badge badge-purple">
//               <span>6 Games Available</span>
//             </div>
//             <div className="badge badge-cyan">
//               <span>Multiplayer Ready</span>
//             </div>
//             <div className="badge badge-green">
//               <span>24/7 Online</span>
//             </div>
//           </div>
//         </section>

//         {/* Games Grid */}
//         <section className="games-section">
//           <h3 className="section-title">
//             Choose Your <span className="gradient-text">Adventure</span>
//           </h3>
          
//           <div className="games-grid">
//             {games.map((game, index) => (
//               <GameCard 
//                 key={index} 
//                 {...game} 
//                 onPlay={handlePlayGame}
//               />
//             ))}
//           </div>
//         </section>

//         {/* Stats Section */}
//         <section className="stats-section">
//           <div className="stats-container">
//             <h3 className="stats-title">Arcade Stats</h3>
//             <div className="stats-grid">
//               <div className="stat-item">
//                 <div className="stat-value stat-purple">1,337</div>
//                 <div className="stat-label">Players Online</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-value stat-cyan">42,069</div>
//                 <div className="stat-label">Games Played Today</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-value stat-green">999,999</div>
//                 <div className="stat-label">High Score Record</div>
//               </div>
//               <div className="stat-item">
//                 <div className="stat-value stat-yellow">24/7</div>
//                 <div className="stat-label">Uptime</div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-content">
//           <p>&copy; 2025 Arcade Zone. Ready Player One?</p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;


















































import React, { useState, useEffect } from 'react';
import { Play, Trophy, Users, Star, Gamepad2, Zap } from 'lucide-react';
import NeonGame from './NeonGame';

const GameCard = ({ title, description, players, difficulty, color, icon: Icon, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`game-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--card-color': color }}
    >
      <div className="game-card-inner">
        <div className="game-card-bg"></div>
        
        <div className="game-card-content">
          <div className="game-icon">
            <Icon size={32} />
          </div>
          
          <h3 className="game-title">{title}</h3>
          <p className="game-description">{description}</p>
          
          <div className="game-info">
            <div className="player-count">
              <Users size={16} />
              <span>{players}</span>
            </div>
            <div className="difficulty">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < difficulty ? 'star-filled' : 'star-empty'} 
                />
              ))}
            </div>
          </div>
          
          <button className="play-button" onClick={() => onPlay(title)}>
            <Play size={16} />
            <span>Play Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const FloatingParticle = ({ delay, duration }) => {
  return (
    <div 
      className="floating-particle"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    ></div>
  );
};

const LandingPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'neonGame'
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePlayGame = (gameName) => {
    if (gameName === 'Neon Runner') {
      setCurrentView('neonGame');
    } else {
      // For other games, show alert for now
      alert(`${gameName} coming soon! Only Neon Runner is available right now.`);
    }
  };

  const handleBackToMenu = () => {
    setCurrentView('landing');
  };

  // If we're in game view, show the game
  if (currentView === 'neonGame') {
    return <NeonGame onBackToMenu={handleBackToMenu} />;
  }

  const games = [
    {
      title: "Neon Runner",
      description: "Fast-paced endless runner through cyberpunk cityscapes",
      players: "1 Player",
      difficulty: 3,
      color: "#06b6d4",
      icon: Zap
    },
    {
      title: "Space Invaders Redux",
      description: "Classic arcade shooter with modern twists and power-ups",
      players: "1-2 Players",
      difficulty: 2,
      color: "#10b981",
      icon: Gamepad2
    },
    {
      title: "Puzzle Matrix",
      description: "Mind-bending puzzle game that challenges your logic",
      players: "1 Player",
      difficulty: 4,
      color: "#8b5cf6",
      icon: Star
    },
    {
      title: "Battle Arena",
      description: "Multiplayer combat arena with various weapons and maps",
      players: "2-4 Players",
      difficulty: 3,
      color: "#ef4444",
      icon: Trophy
    },
    {
      title: "Retro Racer",
      description: "High-speed racing through neon-lit tracks",
      players: "1-4 Players",
      difficulty: 2,
      color: "#f59e0b",
      icon: Zap
    },
    {
      title: "Code Breaker",
      description: "Hacking simulation with real programming challenges",
      players: "1 Player",
      difficulty: 5,
      color: "#6366f1",
      icon: Star
    }
  ];

  return (
    <div className="landing-page">
      {/* Background Elements */}
      <div className="background-gradient"></div>
      <div className="grid-overlay"></div>
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.2} 
          duration={3 + Math.random() * 2}
        />
      ))}

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Gamepad2 size={24} />
            </div>
            <div className="logo-text">
              <h1 className="logo-title">ARCADE ZONE</h1>
              <p className="logo-subtitle">Ultimate Gaming Experience</p>
            </div>
          </div>
          
          <div className="header-info">
            <div className="time-display">
              <p className="time-label">Current Time</p>
              <p className="time-value">
                {currentTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="header-divider"></div>
            <button className="high-scores-btn">High Scores</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <h2 className="hero-title">GAME ON</h2>
          <p className="hero-description">
            Enter the ultimate arcade experience where classic games meet cutting-edge graphics. 
            Choose your adventure and compete for the highest scores!
          </p>
          
          <div className="feature-badges">
            <div className="badge badge-purple">
              <span>6 Games Available</span>
            </div>
            <div className="badge badge-cyan">
              <span>Multiplayer Ready</span>
            </div>
            <div className="badge badge-green">
              <span>24/7 Online</span>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="games-section">
          <h3 className="section-title">
            Choose Your <span className="gradient-text">Adventure</span>
          </h3>
          
          <div className="games-grid">
            {games.map((game, index) => (
              <GameCard 
                key={index} 
                {...game} 
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            <h3 className="stats-title">Arcade Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value stat-purple">1,337</div>
                <div className="stat-label">Players Online</div>
              </div>
              <div className="stat-item">
                <div className="stat-value stat-cyan">42,069</div>
                <div className="stat-label">Games Played Today</div>
              </div>
              <div className="stat-item">
                <div className="stat-value stat-green">999,999</div>
                <div className="stat-label">High Score Record</div>
              </div>
              <div className="stat-item">
                <div className="stat-value stat-yellow">24/7</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Arcade Zone. Ready Player One?</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;