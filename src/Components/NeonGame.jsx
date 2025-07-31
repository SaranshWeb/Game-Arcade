// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

// const NeonGame = ({ onBackToMenu }) => {
//   const canvasRef = useRef(null);
//   const gameLoopRef = useRef(null);
//   const keysRef = useRef({});
  
//   const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver'
//   const [score, setScore] = useState(0);
//   const [highScore, setHighScore] = useState(() => {
//     return parseInt(localStorage.getItem('neonRunnerHighScore') || '0');
//   });
//   const [gameSpeed, setGameSpeed] = useState(2);

//   // Game objects
//   const gameObjects = useRef({
//     player: {
//       x: 100,
//       y: 300,
//       width: 30,
//       height: 30,
//       velocityY: 0,
//       isJumping: false,
//       color: '#06b6d4'
//     },
//     obstacles: [],
//     particles: [],
//     backgroundLines: []
//   });

//   // Initialize background lines
//   useEffect(() => {
//     const lines = [];
//     for (let i = 0; i < 20; i++) {
//       lines.push({
//         x: Math.random() * 800,
//         y: Math.random() * 600,
//         length: Math.random() * 100 + 50,
//         speed: Math.random() * 2 + 1,
//         opacity: Math.random() * 0.5 + 0.2
//       });
//     }
//     gameObjects.current.backgroundLines = lines;
//   }, []);

//   // Handle keyboard input
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       keysRef.current[e.code] = true;
      
//       if (gameState === 'playing') {
//         if (e.code === 'Space' || e.code === 'ArrowUp') {
//           e.preventDefault();
//           jump();
//         }
//       }
      
//       if (e.code === 'Escape') {
//         if (gameState === 'playing') {
//           setGameState('paused');
//         } else if (gameState === 'paused') {
//           setGameState('playing');
//         }
//       }
//     };

//     const handleKeyUp = (e) => {
//       keysRef.current[e.code] = false;
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [gameState]);

//   const jump = useCallback(() => {
//     const player = gameObjects.current.player;
//     if (!player.isJumping) {
//       player.velocityY = -15;
//       player.isJumping = true;
      
//       // Add jump particles
//       for (let i = 0; i < 5; i++) {
//         gameObjects.current.particles.push({
//           x: player.x + player.width / 2,
//           y: player.y + player.height,
//           velocityX: (Math.random() - 0.5) * 4,
//           velocityY: Math.random() * -3,
//           life: 30,
//           maxLife: 30,
//           color: '#06b6d4'
//         });
//       }
//     }
//   }, []);

//   const resetGame = useCallback(() => {
//     gameObjects.current = {
//       player: {
//         x: 100,
//         y: 300,
//         width: 30,
//         height: 30,
//         velocityY: 0,
//         isJumping: false,
//         color: '#06b6d4'
//       },
//       obstacles: [],
//       particles: [],
//       backgroundLines: gameObjects.current.backgroundLines
//     };
//     setScore(0);
//     setGameSpeed(2);
//   }, []);

//   const startGame = useCallback(() => {
//     resetGame();
//     setGameState('playing');
//   }, [resetGame]);

//   const updateGame = useCallback(() => {
//     if (gameState !== 'playing') return;

//     const { player, obstacles, particles, backgroundLines } = gameObjects.current;
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // Update player physics
//     player.velocityY += 0.8; // gravity
//     player.y += player.velocityY;

//     // Ground collision
//     if (player.y >= canvas.height - player.height - 50) {
//       player.y = canvas.height - player.height - 50;
//       player.velocityY = 0;
//       player.isJumping = false;
//     }

//     // Spawn obstacles
//     if (Math.random() < 0.02) {
//       obstacles.push({
//         x: canvas.width,
//         y: canvas.height - 50 - Math.random() * 100,
//         width: 20 + Math.random() * 30,
//         height: 40 + Math.random() * 60,
//         color: '#ef4444'
//       });
//     }

//     // Update obstacles
//     for (let i = obstacles.length - 1; i >= 0; i--) {
//       const obstacle = obstacles[i];
//       obstacle.x -= gameSpeed + 2;
      
//       if (obstacle.x + obstacle.width < 0) {
//         obstacles.splice(i, 1);
//         setScore(prev => prev + 10);
//       }
      
//       // Collision detection
//       if (
//         player.x < obstacle.x + obstacle.width &&
//         player.x + player.width > obstacle.x &&
//         player.y < obstacle.y + obstacle.height &&
//         player.y + player.height > obstacle.y
//       ) {
//         setGameState('gameOver');
//         if (score > highScore) {
//           setHighScore(score);
//           localStorage.setItem('neonRunnerHighScore', score.toString());
//         }
//         return;
//       }
//     }

//     // Update particles
//     for (let i = particles.length - 1; i >= 0; i--) {
//       const particle = particles[i];
//       particle.x += particle.velocityX;
//       particle.y += particle.velocityY;
//       particle.velocityY += 0.2;
//       particle.life--;
      
//       if (particle.life <= 0) {
//         particles.splice(i, 1);
//       }
//     }

//     // Update background lines
//     backgroundLines.forEach(line => {
//       line.x -= line.speed;
//       if (line.x + line.length < 0) {
//         line.x = canvas.width;
//         line.y = Math.random() * canvas.height;
//       }
//     });

//     // Increase game speed gradually
//     setGameSpeed(prev => Math.min(prev + 0.001, 8));
//   }, [gameState, score, highScore]);

//   const draw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
    
//     // Clear canvas with gradient background
//     const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
//     gradient.addColorStop(0, '#0f0f23');
//     gradient.addColorStop(0.5, '#1a0b2e');
//     gradient.addColorStop(1, '#16213e');
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Draw background lines
//     gameObjects.current.backgroundLines.forEach(line => {
//       ctx.strokeStyle = `rgba(6, 182, 212, ${line.opacity})`;
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.moveTo(line.x, line.y);
//       ctx.lineTo(line.x + line.length, line.y);
//       ctx.stroke();
//     });

//     // Draw ground
//     ctx.fillStyle = '#06b6d4';
//     ctx.shadowBlur = 10;
//     ctx.shadowColor = '#06b6d4';
//     ctx.fillRect(0, canvas.height - 50, canvas.width, 2);
//     ctx.shadowBlur = 0;

//     const { player, obstacles, particles } = gameObjects.current;

//     // Draw player with glow effect
//     ctx.fillStyle = player.color;
//     ctx.shadowBlur = 15;
//     ctx.shadowColor = player.color;
//     ctx.fillRect(player.x, player.y, player.width, player.height);
    
//     // Player trail effect
//     ctx.fillStyle = `${player.color}40`;
//     ctx.fillRect(player.x - 5, player.y + 5, player.width, player.height);
//     ctx.shadowBlur = 0;

//     // Draw obstacles with glow
//     obstacles.forEach(obstacle => {
//       ctx.fillStyle = obstacle.color;
//       ctx.shadowBlur = 10;
//       ctx.shadowColor = obstacle.color;
//       ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
//     });
//     ctx.shadowBlur = 0;

//     // Draw particles
//     particles.forEach(particle => {
//       const alpha = particle.life / particle.maxLife;
//       ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
//       ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
//     });

//     // Draw UI
//     ctx.fillStyle = '#06b6d4';
//     ctx.font = 'bold 24px Arial';
//     ctx.fillText(`Score: ${score}`, 20, 40);
//     ctx.fillText(`High: ${highScore}`, 20, 70);
//     ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}x`, 20, 100);

//   }, [score, highScore, gameSpeed]);

//   // Game loop
//   useEffect(() => {
//     const gameLoop = () => {
//       updateGame();
//       draw();
//       gameLoopRef.current = requestAnimationFrame(gameLoop);
//     };

//     if (gameState === 'playing') {
//       gameLoopRef.current = requestAnimationFrame(gameLoop);
//     } else {
//       if (gameLoopRef.current) {
//         cancelAnimationFrame(gameLoopRef.current);
//       }
//       draw(); // Still draw when paused
//     }

//     return () => {
//       if (gameLoopRef.current) {
//         cancelAnimationFrame(gameLoopRef.current);
//       }
//     };
//   }, [gameState, updateGame, draw]);

//   // Set canvas size
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.width = 800;
//       canvas.height = 600;
//     }
//   }, []);

//   return (
//     <div className="neon-game">
//       <div className="game-header">
//         <button className="back-button" onClick={onBackToMenu}>
//           <ArrowLeft size={20} />
//           Back to Menu
//         </button>
//         <h1 className="game-title">NEON RUNNER</h1>
//       </div>

//       <div className="game-container">
//         <canvas
//           ref={canvasRef}
//           className="game-canvas"
//           width={800}
//           height={600}
//         />

//         {gameState === 'menu' && (
//           <div className="game-overlay">
//             <div className="menu-content">
//               <h2>NEON RUNNER</h2>
//               <p>Jump over obstacles and survive as long as you can!</p>
//               <div className="controls-info">
//                 <p><strong>Controls:</strong></p>
//                 <p>SPACE or ↑ Arrow - Jump</p>
//                 <p>ESC - Pause/Resume</p>
//               </div>
//               <button className="play-button" onClick={startGame}>
//                 <Play size={20} />
//                 Start Game
//               </button>
//               <div className="high-score">High Score: {highScore}</div>
//             </div>
//           </div>
//         )}

//         {gameState === 'paused' && (
//           <div className="game-overlay">
//             <div className="menu-content">
//               <h2>PAUSED</h2>
//               <button className="play-button" onClick={() => setGameState('playing')}>
//                 <Play size={20} />
//                 Resume
//               </button>
//               <button className="restart-button" onClick={startGame}>
//                 <RotateCcw size={20} />
//                 Restart
//               </button>
//             </div>
//           </div>
//         )}

//         {gameState === 'gameOver' && (
//           <div className="game-overlay">
//             <div className="menu-content">
//               <h2>GAME OVER</h2>
//               <div className="final-score">Score: {score}</div>
//               {score === highScore && score > 0 && (
//                 <div className="new-record">🎉 NEW HIGH SCORE! 🎉</div>
//               )}
//               <button className="play-button" onClick={startGame}>
//                 <Play size={20} />
//                 Play Again
//               </button>
//               <button className="menu-button" onClick={() => setGameState('menu')}>
//                 Back to Menu
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="game-instructions">
//         <p>Jump over the red obstacles and collect points. The game gets faster as you progress!</p>
//       </div>
//     </div>
//   );
// };

// export default NeonGame;




























































// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

// const NeonGame = ({ onBackToMenu }) => {
//   const canvasRef = useRef(null);
//   const gameLoopRef = useRef(null);
//   const keysRef = useRef({});

//   const jumpPressedRef = useRef(false);
//   const coyoteTimeRef = useRef(0);
//   const jumpBufferRef = useRef(0);

//   const [gameState, setGameState] = useState('menu');
//   const [score, setScore] = useState(0);
//   const [highScore, setHighScore] = useState(() =>
//     parseInt(localStorage.getItem('neonRunnerHighScore') || '0')
//   );
//   const [gameSpeed, setGameSpeed] = useState(2);

//   const gameObjects = useRef({
//     player: {
//       x: 100,
//       y: 300,
//       width: 30,
//       height: 30,
//       velocityY: 0,
//       isJumping: false,
//       color: '#06b6d4'
//     },
//     obstacles: [],
//     particles: [],
//     backgroundLines: []
//   });

//   useEffect(() => {
//     const lines = [];
//     for (let i = 0; i < 20; i++) {
//       lines.push({
//         x: Math.random() * 800,
//         y: Math.random() * 600,
//         length: Math.random() * 100 + 50,
//         speed: Math.random() * 2 + 1,
//         opacity: Math.random() * 0.5 + 0.2
//       });
//     }
//     gameObjects.current.backgroundLines = lines;
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       keysRef.current[e.code] = true;

//       if (e.code === 'Space' || e.code === 'ArrowUp') {
//         e.preventDefault();
//         if (!jumpPressedRef.current) {
//           jumpPressedRef.current = true;
//           jumpBufferRef.current = 10;
//         }
//       }

//       if (e.code === 'Escape') {
//         setGameState(prev => (prev === 'playing' ? 'paused' : 'playing'));
//       }
//     };

//     const handleKeyUp = (e) => {
//       keysRef.current[e.code] = false;
//       if (e.code === 'Space' || e.code === 'ArrowUp') {
//         jumpPressedRef.current = false;
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   const jump = useCallback(() => {
//     const player = gameObjects.current.player;
//     if (!player.isJumping || coyoteTimeRef.current > 0) {
//       player.velocityY = -15;
//       player.isJumping = true;
//       coyoteTimeRef.current = 0;

//       for (let i = 0; i < 5; i++) {
//         gameObjects.current.particles.push({
//           x: player.x + player.width / 2,
//           y: player.y + player.height,
//           velocityX: (Math.random() - 0.5) * 4,
//           velocityY: Math.random() * -3,
//           life: 30,
//           maxLife: 30,
//           color: '#06b6d4'
//         });
//       }
//     }
//   }, []);

//   const resetGame = useCallback(() => {
//     gameObjects.current = {
//       player: {
//         x: 100,
//         y: 300,
//         width: 30,
//         height: 30,
//         velocityY: 0,
//         isJumping: false,
//         color: '#06b6d4'
//       },
//       obstacles: [],
//       particles: [],
//       backgroundLines: gameObjects.current.backgroundLines
//     };
//     setScore(0);
//     setGameSpeed(2);
//   }, []);

//   const startGame = useCallback(() => {
//     resetGame();
//     setGameState('playing');
//   }, [resetGame]);

//   const updateGame = useCallback(() => {
//     if (gameState !== 'playing') return;

//     const { player, obstacles, particles, backgroundLines } = gameObjects.current;
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // Jump buffering logic
//     if (jumpBufferRef.current > 0) {
//       jumpBufferRef.current--;
//     }

//     if (jumpBufferRef.current > 0 && (!player.isJumping || coyoteTimeRef.current > 0)) {
//       jump();
//       jumpBufferRef.current = 0;
//     }

//     // Player physics
//     if (player.velocityY < 0 && !jumpPressedRef.current) {
//       player.velocityY += 1.2; // more gravity if jump key released
//     } else {
//       player.velocityY += 0.8; // normal gravity
//     }

//     player.y += player.velocityY;

//     // Ground collision
//     if (player.y >= canvas.height - player.height - 50) {
//       player.y = canvas.height - player.height - 50;
//       player.velocityY = 0;
//       player.isJumping = false;
//       coyoteTimeRef.current = 10;
//     } else {
//       if (coyoteTimeRef.current > 0) coyoteTimeRef.current--;
//     }

//     // Spawn obstacles
//     if (Math.random() < 0.02) {
//       obstacles.push({
//         x: canvas.width,
//         y: canvas.height - 50 - Math.random() * 100,
//         width: 20 + Math.random() * 30,
//         height: 40 + Math.random() * 60,
//         color: '#ef4444'
//       });
//     }

//     // Move and check collision
//     for (let i = obstacles.length - 1; i >= 0; i--) {
//       const obstacle = obstacles[i];
//       obstacle.x -= gameSpeed + 2;

//       if (obstacle.x + obstacle.width < 0) {
//         obstacles.splice(i, 1);
//         setScore(prev => prev + 10);
//       }

//       if (
//         player.x < obstacle.x + obstacle.width &&
//         player.x + player.width > obstacle.x &&
//         player.y < obstacle.y + obstacle.height &&
//         player.y + player.height > obstacle.y
//       ) {
//         setGameState('gameOver');
//         if (score > highScore) {
//           setHighScore(score);
//           localStorage.setItem('neonRunnerHighScore', score.toString());
//         }
//         return;
//       }
//     }

//     // Particles
//     for (let i = particles.length - 1; i >= 0; i--) {
//       const particle = particles[i];
//       particle.x += particle.velocityX;
//       particle.y += particle.velocityY;
//       particle.velocityY += 0.2;
//       particle.life--;

//       if (particle.life <= 0) {
//         particles.splice(i, 1);
//       }
//     }

//     // Background lines
//     backgroundLines.forEach(line => {
//       line.x -= line.speed;
//       if (line.x + line.length < 0) {
//         line.x = canvas.width;
//         line.y = Math.random() * canvas.height;
//       }
//     });

//     // Speed increase
//     setGameSpeed(prev => Math.min(prev + 0.001, 8));
//   }, [gameState, jump, score, highScore]);

//   const draw = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');

//     const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
//     gradient.addColorStop(0, '#0f0f23');
//     gradient.addColorStop(0.5, '#1a0b2e');
//     gradient.addColorStop(1, '#16213e');
//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     gameObjects.current.backgroundLines.forEach(line => {
//       ctx.strokeStyle = `rgba(6, 182, 212, ${line.opacity})`;
//       ctx.lineWidth = 1;
//       ctx.beginPath();
//       ctx.moveTo(line.x, line.y);
//       ctx.lineTo(line.x + line.length, line.y);
//       ctx.stroke();
//     });

//     ctx.fillStyle = '#06b6d4';
//     ctx.shadowBlur = 10;
//     ctx.shadowColor = '#06b6d4';
//     ctx.fillRect(0, canvas.height - 50, canvas.width, 2);
//     ctx.shadowBlur = 0;

//     const { player, obstacles, particles } = gameObjects.current;

//     ctx.fillStyle = player.color;
//     ctx.shadowBlur = 15;
//     ctx.shadowColor = player.color;
//     ctx.fillRect(player.x, player.y, player.width, player.height);
//     ctx.fillStyle = `${player.color}40`;
//     ctx.fillRect(player.x - 5, player.y + 5, player.width, player.height);
//     ctx.shadowBlur = 0;

//     obstacles.forEach(obstacle => {
//       ctx.fillStyle = obstacle.color;
//       ctx.shadowBlur = 10;
//       ctx.shadowColor = obstacle.color;
//       ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
//     });
//     ctx.shadowBlur = 0;

//     particles.forEach(particle => {
//       const alpha = particle.life / particle.maxLife;
//       ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
//       ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
//     });

//     ctx.fillStyle = '#06b6d4';
//     ctx.font = 'bold 24px Arial';
//     ctx.fillText(`Score: ${score}`, 20, 40);
//     ctx.fillText(`High: ${highScore}`, 20, 70);
//     ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}x`, 20, 100);
//   }, [score, highScore, gameSpeed]);

//   useEffect(() => {
//     const gameLoop = () => {
//       updateGame();
//       draw();
//       gameLoopRef.current = requestAnimationFrame(gameLoop);
//     };

//     if (gameState === 'playing') {
//       gameLoopRef.current = requestAnimationFrame(gameLoop);
//     } else {
//       if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
//       draw();
//     }

//     return () => {
//       if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
//     };
//   }, [gameState, updateGame, draw]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       canvas.width = 800;
//       canvas.height = 600;
//     }
//   }, []);

//   return (
//     <div className="neon-game">
//       <div className="game-header">
//         <button className="back-button" onClick={onBackToMenu}>
//           <ArrowLeft size={20} /> Back to Menu
//         </button>
//         <h1 className="game-title">NEON RUNNER</h1>
//       </div>

//       <div className="game-container">
//         <canvas ref={canvasRef} className="game-canvas" width={800} height={600} />

//         {gameState === 'menu' && (
//           <div className="game-overlay">
//             <div className="menu-content">
//               <h2>NEON RUNNER</h2>
//               <p>Jump over obstacles and survive as long as you can!</p>
//               <div className="controls-info">
//                 <p><strong>Controls:</strong></p>
//                 <p>SPACE or ↑ Arrow - Jump</p>
//                 <p>ESC - Pause/Resume</p>
//               </div>
//               <button className="play-button" onClick={startGame}>
//                 <Play size={20} /> Start Game
//               </button>
//               <div className="high-score">High Score: {highScore}</div>
//             </div>
//           </div>
//         )}

//         {gameState === 'paused' && (
//           <div className="game-overlay">
//             <div className="menu-content">
//               <h2>PAUSED</h2>
//               <button className="play-button" onClick={() => setGameState('playing')}>
//                 <Play size={20} /> Resume
//               </button>
//               <button className="restart-button" onClick={startGame}>
//                 <RotateCcw size={20} /> Restart
//               </button>
//             </div>
//           </div>
//         )}

//         {gameState === 'gameOver' && (
//           <div className="game-overlay">
//             <div className="menu-content">
//               <h2>GAME OVER</h2>
//               <div className="final-score">Score: {score}</div>
//               {score === highScore && score > 0 && (
//                 <div className="new-record">🎉 NEW HIGH SCORE! 🎉</div>
//               )}
//               <button className="play-button" onClick={startGame}>
//                 <Play size={20} /> Play Again
//               </button>
//               <button className="menu-button" onClick={() => setGameState('menu')}>
//                 Back to Menu
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="game-instructions">
//         <p>Jump over the red obstacles and collect points. The game gets faster as you progress!</p>
//       </div>
//     </div>
//   );
// };

// export default NeonGame;





































































