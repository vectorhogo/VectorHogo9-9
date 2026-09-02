import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Pause, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 18;
const INITIAL_SPEED = 120;

export const SnakeGame: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const { progress, recordGameResult } = useProgress();
  const bestScore = progress.gameStats?.snakeBestScore || 0;

  const [snake, setSnake] = useState<Position[]>([
    { x: 9, y: 9 },
    { x: 9, y: 10 },
    { x: 9, y: 11 }
  ]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef<Direction>('UP');
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Make sure food is not on the snake
      const onSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake: Position[] = [
      { x: 9, y: 9 },
      { x: 9, y: 10 },
      { x: 9, y: 11 }
    ];
    setSnake(initialSnake);
    setDirection('UP');
    directionRef.current = 'UP';
    setFood(generateFood(initialSnake));
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  };

  const handleGameOver = (finalScore: number) => {
    setIsGameOver(true);
    setIsPlaying(false);
    recordGameResult('snake', finalScore);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only capture if playing or starting
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space') {
        if (!isPlaying && !isGameOver) {
          setIsPlaying(true);
        } else if (isPlaying) {
          setIsPaused(prev => !prev);
        }
        return;
      }

      if (!isPlaying || isPaused || isGameOver) return;

      const current = directionRef.current;
      if ((e.code === 'ArrowUp' || e.code === 'KeyW') && current !== 'DOWN') {
        setDirection('UP');
      } else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && current !== 'UP') {
        setDirection('DOWN');
      } else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && current !== 'RIGHT') {
        setDirection('LEFT');
      } else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && current !== 'LEFT') {
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isGameOver]);

  // Main game tick loop
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const currentDir = directionRef.current;

        if (currentDir === 'UP') head.y -= 1;
        if (currentDir === 'DOWN') head.y += 1;
        if (currentDir === 'LEFT') head.x -= 1;
        if (currentDir === 'RIGHT') head.x += 1;

        // Collision with walls
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          handleGameOver(score);
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          handleGameOver(score);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, isGameOver, food, score, generateFood]);

  const changeDir = (newDir: Direction) => {
    if (!isPlaying || isPaused || isGameOver) return;
    const current = directionRef.current;
    if (newDir === 'UP' && current !== 'DOWN') setDirection('UP');
    if (newDir === 'DOWN' && current !== 'UP') setDirection('DOWN');
    if (newDir === 'LEFT' && current !== 'RIGHT') setDirection('LEFT');
    if (newDir === 'RIGHT' && current !== 'LEFT') setDirection('RIGHT');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      
      {/* Header Info */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 bg-[#141414] px-5 py-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-vazir">امتیاز:</span>
          <span className="text-xl font-bold font-mono text-cyan-400">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-gray-400 font-vazir">بهترین:</span>
          <span className="text-xl font-bold font-mono text-amber-400">{Math.max(bestScore, score)}</span>
        </div>
      </div>

      {/* Game Canvas Board */}
      <div className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden">
        <div
          className="grid gap-1 bg-[#111] p-1.5 rounded-xl border border-white/5"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(360px, 80vw)',
            height: 'min(360px, 80vw)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isBody = !isHead && snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={idx}
                className={`rounded-[3px] transition-all duration-75 ${
                  isHead
                    ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-105 z-10'
                    : isBody
                    ? 'bg-emerald-500/80 border border-emerald-400/30'
                    : isFood
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse'
                    : 'bg-[#171717]/40'
                }`}
              />
            );
          })}
        </div>

        {/* Start / Pause / GameOver Overlay */}
        {(!isPlaying || isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-200">
            {isGameOver ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 font-bold text-lg font-mono">
                  ✕
                </div>
                <h3 className="text-lg font-extrabold text-white font-vazir">پایان بازی!</h3>
                <p className="text-xs text-gray-300 font-vazir">
                  امتیاز کسب‌شده: <span className="text-cyan-400 font-mono font-bold text-sm">{score}</span>
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 mx-auto font-vazir transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>تلاش مجدد</span>
                </button>
              </div>
            ) : isPaused ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Pause className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white font-vazir">بازی متوقف شد</h3>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 mx-auto font-vazir transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ادامه بازی</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white font-vazir">بازی کلاسیک مار (Snake)</h3>
                <p className="text-xs text-gray-400 font-vazir max-w-xs">
                  با کلیدهای جهت‌نما یا WASD مار را هدایت کنید و از برخورد به دیوارها یا دم مار پرهیز کنید.
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 mx-auto font-vazir transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>شروع بازی</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls Bar & Touch Directional Pad */}
      <div className="w-full max-w-md mt-4 space-y-3">
        <div className="flex items-center justify-center gap-3">
          {isPlaying && (
            <button
              onClick={() => setIsPaused(prev => !prev)}
              className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-white/5 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors font-vazir"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'ادامه' : 'توقف موقت'}</span>
            </button>
          )}

          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-white/5 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors font-vazir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>شروع دوباره</span>
          </button>
        </div>

        {/* Mobile / Touch D-pad */}
        <div className="flex flex-col items-center gap-1 pt-1 sm:hidden">
          <button
            onClick={() => changeDir('UP')}
            className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeDir('LEFT')}
              className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => changeDir('DOWN')}
              className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onClick={() => changeDir('RIGHT')}
              className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="hidden sm:block text-center text-[11px] text-gray-500 font-vazir pt-1">
          کلیدهای جهت‌نما / WASD برای حرکت • فاصله (Space) برای مکث
        </div>
      </div>

    </div>
  );
};
