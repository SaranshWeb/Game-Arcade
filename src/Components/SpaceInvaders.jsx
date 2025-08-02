import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Users } from 'lucide-react';

const SpaceInvaders = ({ onBackToMenu }) => {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  const keysRef = useRef({});
  
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'paused', 'gameOver', 'victory'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('spaceInvadersHighScore') || '0');
  });
  const [twoPlayerMode, setTwoPlayerMode] = useState(false);

  // Game objects
  const gameObjects = useRef({
    player: {
      x: 375,
      y: 550,
      width: 50,
      height: 30,
      color: '#10b981',
      speed: 5
    },
    player2: {
      x: 325,
      y: 550,
      width: 50,
      height: 30,
      color: '#06b6d4',
      speed: 5,
      active: false
    },
    bullets: [],
    enemyBullets: [],
    invaders: [],
    particles: [],
    powerUps: [],
    stars: []
  });

  // Initialize stars background
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    gameObjects.current.stars = stars;
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.code] = true;
      
      if (gameState === 'playing') {
        // Player 1 controls
        if (e.code === 'Space') {
          e.preventDefault();
          shoot(1);
        }
        
        // Player 2 controls (if enabled)
        if (twoPlayerMode && e.code === 'Enter') {
          e.preventDefault();
          shoot(2);
        }
      }
      
      if (e.code === 'Escape') {
        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, twoPlayerMode]);

  const shoot = useCallback((playerNum) => {
    const player = playerNum === 1 ? gameObjects.current.player : gameObjects.current.player2;
    if (!player.active && playerNum === 2) return;
    
    gameObjects.current.bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      speed: 8,
      color: player.color,
      player: playerNum
    });
    
    // Add muzzle flash particles
    for (let i = 0; i < 3; i++) {
      gameObjects.current.particles.push({
        x: player.x + player.width / 2,
        y: player.y,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: -Math.random() * 3,
        life: 15,
        maxLife: 15,
        color: player.color,
        size: 3
      });
    }
  }, []);

  const createInvaders = useCallback(() => {
    const invaders = [];
    const rows = 5;
    const cols = 10;
    const invaderWidth = 40;
    const invaderHeight = 30;
    const spacing = 50;
    const startX = 100;
    const startY = 80;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let color, points;
        if (row === 0) {
          color = '#ef4444'; // Red - top row (30 points)
          points = 30;
        } else if (row < 3) {
          color = '#f59e0b'; // Yellow - middle rows (20 points)
          points = 20;
        } else {
          color = '#10b981'; // Green - bottom rows (10 points)
          points = 10;
        }
        
        invaders.push({
          x: startX + col * spacing,
          y: startY + row * spacing,
          width: invaderWidth,
          height: invaderHeight,
          color: color,
          points: points,
          alive: true,
          animFrame: 0
        });
      }
    }
    
    gameObjects.current.invaders = invaders;
  }, []);

  const resetGame = useCallback(() => {
    gameObjects.current = {
      player: {
        x: 375,
        y: 550,
        width: 50,
        height: 30,
        color: '#10b981',
        speed: 5
      },
      player2: {
        x: 325,
        y: 550,
        width: 50,
        height: 30,
        color: '#06b6d4',
        speed: 5,
        active: twoPlayerMode
      },
      bullets: [],
      enemyBullets: [],
      invaders: [],
      particles: [],
      powerUps: [],
      stars: gameObjects.current.stars
    };
    createInvaders();
    setScore(0);
    setLives(3);
    setLevel(1);
  }, [createInvaders, twoPlayerMode]);

  const startGame = useCallback((multiplayer = false) => {
    setTwoPlayerMode(multiplayer);
    resetGame();
    setGameState('playing');
  }, [resetGame]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    const { player, player2, bullets, enemyBullets, invaders, particles, powerUps, stars } = gameObjects.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update player movement
    if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
      player.x = Math.max(0, player.x - player.speed);
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }

    // Update player 2 movement (if active)
    if (player2.active) {
      if (keysRef.current['KeyJ']) {
        player2.x = Math.max(0, player2.x - player2.speed);
      }
      if (keysRef.current['KeyL']) {
        player2.x = Math.min(canvas.width - player2.width, player2.x + player2.speed);
      }
    }

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      bullet.y -= bullet.speed;
      
      if (bullet.y < 0) {
        bullets.splice(i, 1);
        continue;
      }
      
      // Check collision with invaders
      for (let j = invaders.length - 1; j >= 0; j--) {
        const invader = invaders[j];
        if (!invader.alive) continue;
        
        if (
          bullet.x < invader.x + invader.width &&
          bullet.x + bullet.width > invader.x &&
          bullet.y < invader.y + invader.height &&
          bullet.y + bullet.height > invader.y
        ) {
          // Hit!
          invader.alive = false;
          bullets.splice(i, 1);
          setScore(prev => prev + invader.points);
          
          // Create explosion particles
          for (let k = 0; k < 8; k++) {
            particles.push({
              x: invader.x + invader.width / 2,
              y: invader.y + invader.height / 2,
              velocityX: (Math.random() - 0.5) * 6,
              velocityY: (Math.random() - 0.5) * 6,
              life: 30,
              maxLife: 30,
              color: invader.color,
              size: 4
            });
          }
          
          // Chance to drop power-up
          if (Math.random() < 0.1) {
            powerUps.push({
              x: invader.x + invader.width / 2,
              y: invader.y,
              width: 20,
              height: 20,
              type: Math.random() < 0.5 ? 'rapidFire' : 'extraLife',
              speed: 2
            });
          }
          
          break;
        }
      }
    }

    // Update enemy bullets
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const bullet = enemyBullets[i];
      bullet.y += bullet.speed;
      
      if (bullet.y > canvas.height) {
        enemyBullets.splice(i, 1);
        continue;
      }
      
      // Check collision with players
      if (
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
      ) {
        enemyBullets.splice(i, 1);
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('spaceInvadersHighScore', score.toString());
            }
          }
          return newLives;
        });
        
        // Player hit particles
        for (let k = 0; k < 10; k++) {
          particles.push({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            velocityX: (Math.random() - 0.5) * 8,
            velocityY: (Math.random() - 0.5) * 8,
            life: 40,
            maxLife: 40,
            color: '#ef4444',
            size: 3
          });
        }
        break;
      }
      
      // Check collision with player 2
      if (player2.active &&
        bullet.x < player2.x + player2.width &&
        bullet.x + bullet.width > player2.x &&
        bullet.y < player2.y + player2.height &&
        bullet.y + bullet.height > player2.y
      ) {
        enemyBullets.splice(i, 1);
        // Player 2 hit - could implement separate lives or shared lives
        break;
      }
    }

    // Enemy shooting
    if (Math.random() < 0.02) {
      const aliveInvaders = invaders.filter(inv => inv.alive);
      if (aliveInvaders.length > 0) {
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
        enemyBullets.push({
          x: shooter.x + shooter.width / 2 - 2,
          y: shooter.y + shooter.height,
          width: 4,
          height: 8,
          speed: 3,
          color: '#ef4444'
        });
      }
    }

    // Update power-ups
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUp = powerUps[i];
      powerUp.y += powerUp.speed;
      
      if (powerUp.y > canvas.height) {
        powerUps.splice(i, 1);
        continue;
      }
      
      // Check collision with players
      if (
        powerUp.x < player.x + player.width &&
        powerUp.x + powerUp.width > player.x &&
        powerUp.y < player.y + player.height &&
        powerUp.y + powerUp.height > player.y
      ) {
        powerUps.splice(i, 1);
        if (powerUp.type === 'extraLife') {
          setLives(prev => prev + 1);
        }
        // Add power-up effect particles
        for (let k = 0; k < 5; k++) {
          particles.push({
            x: powerUp.x + powerUp.width / 2,
            y: powerUp.y + powerUp.height / 2,
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: (Math.random() - 0.5) * 4,
            life: 25,
            maxLife: 25,
            color: '#f59e0b',
            size: 3
          });
        }
      }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityX *= 0.98;
      particle.velocityY *= 0.98;
      particle.life--;
      
      if (particle.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // Update stars
    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    // Update invader animation
    invaders.forEach(invader => {
      if (invader.alive) {
        invader.animFrame = (invader.animFrame + 0.1) % (Math.PI * 2);
      }
    });

    // Check win condition
    const aliveInvaders = invaders.filter(inv => inv.alive);
    if (aliveInvaders.length === 0) {
      setLevel(prev => prev + 1);
      createInvaders();
      setScore(prev => prev + 100 * level); // Level bonus
    }

  }, [gameState, score, highScore, level, createInvaders]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with space background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.5, '#1a0b2e');
    gradient.addColorStop(1, '#0f0a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    gameObjects.current.stars.forEach(star => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    const { player, player2, bullets, enemyBullets, invaders, particles, powerUps } = gameObjects.current;

    // Draw players with glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = player.color;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw player 2 if active
    if (player2.active) {
      ctx.shadowColor = player2.color;
      ctx.fillStyle = player2.color;
      ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    }
    ctx.shadowBlur = 0;

    // Draw invaders
    invaders.forEach(invader => {
      if (!invader.alive) return;
      
      ctx.fillStyle = invader.color;
      ctx.shadowBlur = 5;
      ctx.shadowColor = invader.color;
      
      // Simple animation - slight size pulsing
      const pulse = Math.sin(invader.animFrame) * 2;
      ctx.fillRect(
        invader.x - pulse/2, 
        invader.y - pulse/2, 
        invader.width + pulse, 
        invader.height + pulse
      );
    });
    ctx.shadowBlur = 0;

    // Draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw enemy bullets
    enemyBullets.forEach(bullet => {
      ctx.fillStyle = bullet.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = bullet.color;
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    ctx.shadowBlur = 0;

    // Draw power-ups
    powerUps.forEach(powerUp => {
      ctx.fillStyle = powerUp.type === 'extraLife' ? '#10b981' : '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      
      // Draw power-up symbol
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      const symbol = powerUp.type === 'extraLife' ? '+' : 'R';
      ctx.fillText(symbol, powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2 + 4);
    });
    ctx.shadowBlur = 0;

    // Draw particles
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
    });

    // Draw UI
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Lives: ${lives}`, 20, 55);
    ctx.fillText(`Level: ${level}`, 20, 80);
    ctx.fillText(`High: ${highScore}`, canvas.width - 150, 30);

    // Draw lives indicator
    for (let i = 0; i < lives; i++) {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(canvas.width - 50 - (i * 25), 50, 20, 15);
    }

  }, [score, lives, level, highScore]);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      updateGame();
      draw();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      draw(); // Still draw when paused
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, updateGame, draw]);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
    }
  }, []);

  return (
    <div className="space-invaders">
      <div className="game-header">
        <button className="back-button" onClick={onBackToMenu}>
          <ArrowLeft size={20} />
          Back to Menu
        </button>
        <h1 className="game-title">SPACE INVADERS REDUX</h1>
      </div>

      <div className="game-container">
        <canvas
          ref={canvasRef}
          className="game-canvas"
          width={800}
          height={600}
        />

        {gameState === 'menu' && (
          <div className="game-overlay">
            <div className="menu-content">
              <h2>SPACE INVADERS REDUX</h2>
              <p>Defend Earth from the alien invasion!</p>
              <div className="controls-info">
                <p><strong>Single Player Controls:</strong></p>
                <p>A/D or ←/→ - Move</p>
                <p>SPACE - Shoot</p>
                <br />
                <p><strong>Two Player Controls:</strong></p>
                <p>Player 1: A/D, SPACE</p>
                <p>Player 2: J/L, ENTER</p>
                <p>ESC - Pause/Resume</p>
              </div>
              <div className="game-mode-buttons">
                <button className="play-button" onClick={() => startGame(false)}>
                  <Play size={20} />
                  Single Player
                </button>
                <button className="play-button multiplayer" onClick={() => startGame(true)}>
                  <Users size={20} />
                  Two Players
                </button>
              </div>
              <div className="high-score">High Score: {highScore}</div>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="game-overlay">
            <div className="menu-content">
              <h2>PAUSED</h2>
              <button className="play-button" onClick={() => setGameState('playing')}>
                <Play size={20} />
                Resume
              </button>
              <button className="restart-button" onClick={() => startGame(twoPlayerMode)}>
                <RotateCcw size={20} />
                Restart
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="game-overlay">
            <div className="menu-content">
              <h2>GAME OVER</h2>
              <div className="final-score">Final Score: {score}</div>
              <div className="final-score">Level Reached: {level}</div>
              {score === highScore && score > 0 && (
                <div className="new-record">🚀 NEW HIGH SCORE! 🚀</div>
              )}
              <button className="play-button" onClick={() => startGame(twoPlayerMode)}>
                <Play size={20} />
                Play Again
              </button>
              <button className="menu-button" onClick={() => setGameState('menu')}>
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="game-instructions">
        <p>Destroy all invaders to advance to the next level. Collect power-ups for extra lives and rapid fire!</p>
      </div>
    </div>
  );
};

export default SpaceInvaders;