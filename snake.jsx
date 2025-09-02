import React, { useState, useEffect, useRef } from 'react';

// The main App component for the Snake Game
// All game logic, state management, and rendering are contained within this single component.
const App = () => {
  // Game constants
  const CANVAS_SIZE = 400;
  const SCALE = 20;
  const INITIAL_SNAKE = [{ x: 8, y: 8 }];
  const INITIAL_FOOD = { x: 15, y: 15 };
  const INITIAL_DIRECTION = 'RIGHT';

  // Game state hooks
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [speed, setSpeed] = useState(150);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const canvasRef = useRef(null);

  // Function to start or restart the game
  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setSpeed(150);
  };

  // Handle keyboard input for snake direction
  const handleKeyDown = (e) => {
    if (isGameOver) return;
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  // Generate a new food position randomly
  const generateFood = () => {
    const x = Math.floor(Math.random() * (CANVAS_SIZE / SCALE));
    const y = Math.floor(Math.random() * (CANVAS_SIZE / SCALE));
    return { x, y };
  };

  // Main game loop using useEffect
  useEffect(() => {
    if (isGameOver) return;

    // Set up the interval for the game loop
    const gameLoop = setInterval(() => {
      // Create a new snake head based on the current direction
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      // Check for wall or self-collision
      if (
        head.x < 0 || head.x >= CANVAS_SIZE / SCALE ||
        head.y < 0 || head.y >= CANVAS_SIZE / SCALE ||
        newSnake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      newSnake.unshift(head); // Add the new head to the front

      // Check if the snake ate the food
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood()); // Generate new food
        setScore(score + 1); // Increase score
      } else {
        newSnake.pop(); // Remove the tail if no food was eaten
      }

      setSnake(newSnake); // Update the snake's position

    }, speed);

    // Clean up the interval on component unmount or when dependencies change
    return () => clearInterval(gameLoop);

  }, [snake, direction, food, isGameOver, speed]);

  // Handle drawing on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    snake.forEach(segment => {
      ctx.fillStyle = '#4ADE80'; // Tailwind 'green-400'
      ctx.fillRect(segment.x * SCALE, segment.y * SCALE, SCALE, SCALE);
      ctx.strokeStyle = '#FFFFFF';
      ctx.strokeRect(segment.x * SCALE, segment.y * SCALE, SCALE, SCALE);
    });

    // Draw food
    ctx.fillStyle = '#FB7185'; // Tailwind 'rose-400'
    ctx.fillRect(food.x * SCALE, food.y * SCALE, SCALE, SCALE);
  }, [snake, food]);

  // Handle keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border-2 border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-rose-400">Snake Game</h1>
        <p className="text-xl font-bold text-center mb-4 text-gray-400">Score: <span className="text-green-400">{score}</span></p>
        
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-gray-900 rounded-lg border-2 border-green-400 shadow-inner my-4"
        ></canvas>

        {isGameOver && (
          <div className="text-center mt-4">
            <p className="text-3xl font-bold text-rose-500 animate-pulse">Game Over!</p>
            <button
              onClick={startGame}
              className="mt-4 px-6 py-3 bg-rose-500 text-white font-semibold rounded-full shadow-lg transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Play Again
            </button>
          </div>
        )}

        {!isGameOver && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <p className="text-lg text-gray-400">Use arrow keys to move.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
