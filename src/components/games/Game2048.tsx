import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

type Board = number[][];

const BOARD_SIZE = 4;

const TILE_COLORS: Record<number, { bg: string; text: string; glow?: string }> = {
  2: { bg: 'bg-[#1e293b]', text: 'text-slate-200' },
  4: { bg: 'bg-[#0f3b4c]', text: 'text-cyan-200' },
  8: { bg: 'bg-[#144f5d]', text: 'text-cyan-100', glow: 'shadow-[0_0_10px_rgba(6,182,212,0.3)]' },
  16: { bg: 'bg-[#1d4ed8]', text: 'text-blue-100', glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]' },
  32: { bg: 'bg-[#4338ca]', text: 'text-indigo-100', glow: 'shadow-[0_0_12px_rgba(99,102,241,0.3)]' },
  64: { bg: 'bg-[#6d28d9]', text: 'text-purple-100', glow: 'shadow-[0_0_14px_rgba(147,51,234,0.4)]' },
  128: { bg: 'bg-[#86198f]', text: 'text-fuchsia-100', glow: 'shadow-[0_0_16px_rgba(217,70,239,0.4)]' },
  256: { bg: 'bg-[#9f1239]', text: 'text-rose-100', glow: 'shadow-[0_0_18px_rgba(244,63,94,0.4)]' },
  512: { bg: 'bg-[#b45309]', text: 'text-amber-100', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]' },
  1024: { bg: 'bg-[#047857]', text: 'text-emerald-100', glow: 'shadow-[0_0_22px_rgba(16,185,129,0.6)]' },
  2048: { bg: 'bg-gradient-to-tr from-cyan-400 to-violet-500', text: 'text-black font-extrabold', glow: 'shadow-[0_0_25px_rgba(34,211,238,0.7)]' }
};

export const Game2048: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const { progress, recordGameResult } = useProgress();
  const bestScore = progress.gameStats?.game2048BestScore || 0;

  const [board, setBoard] = useState<Board>(() => getInitialBoard());
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [highestTile, setHighestTile] = useState(2);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  function getInitialBoard(): Board {
    const b: Board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    addRandomTile(b);
    addRandomTile(b);
    return b;
  }

  function addRandomTile(b: Board): boolean {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (b[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return false;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    b[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return true;
  }

  const resetGame = () => {
    const newBoard = getInitialBoard();
    setBoard(newBoard);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
    setHighestTile(2);
  };

  const checkGameOver = (currentBoard: Board): boolean => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (currentBoard[r][c] === 0) return false;
        if (r < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r + 1][c]) return false;
        if (c < BOARD_SIZE - 1 && currentBoard[r][c] === currentBoard[r][c + 1]) return false;
      }
    }
    return true;
  };

  const move = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (isGameOver) return;

    setBoard((prev) => {
      let current = prev.map(row => [...row]);
      let moved = false;
      let pointsGained = 0;
      let maxTile = highestTile;

      const slideAndCombine = (row: number[]) => {
        // Filter out zeroes
        let filtered = row.filter(val => val !== 0);
        let newRow: number[] = [];
        let skip = false;

        for (let i = 0; i < filtered.length; i++) {
          if (skip) {
            skip = false;
            continue;
          }
          if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
            const merged = filtered[i] * 2;
            newRow.push(merged);
            pointsGained += merged;
            if (merged > maxTile) maxTile = merged;
            skip = true;
          } else {
            newRow.push(filtered[i]);
          }
        }
        while (newRow.length < BOARD_SIZE) {
          newRow.push(0);
        }
        return newRow;
      };

      if (dir === 'LEFT') {
        for (let r = 0; r < BOARD_SIZE; r++) {
          const newRow = slideAndCombine(current[r]);
          if (newRow.some((val, idx) => val !== current[r][idx])) moved = true;
          current[r] = newRow;
        }
      } else if (dir === 'RIGHT') {
        for (let r = 0; r < BOARD_SIZE; r++) {
          const reversed = [...current[r]].reverse();
          const newRow = slideAndCombine(reversed).reverse();
          if (newRow.some((val, idx) => val !== current[r][idx])) moved = true;
          current[r] = newRow;
        }
      } else if (dir === 'UP') {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const col = [current[0][c], current[1][c], current[2][c], current[3][c]];
          const newCol = slideAndCombine(col);
          for (let r = 0; r < BOARD_SIZE; r++) {
            if (current[r][c] !== newCol[r]) moved = true;
            current[r][c] = newCol[r];
          }
        }
      } else if (dir === 'DOWN') {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const col = [current[3][c], current[2][c], current[1][c], current[0][c]];
          const newCol = slideAndCombine(col).reverse();
          for (let r = 0; r < BOARD_SIZE; r++) {
            if (current[r][c] !== newCol[r]) moved = true;
            current[r][c] = newCol[r];
          }
        }
      }

      if (moved) {
        addRandomTile(current);
        const newScore = score + pointsGained;
        setScore(newScore);
        setHighestTile(maxTile);

        if (maxTile >= 2048 && !hasWon) {
          setHasWon(true);
        }

        const over = checkGameOver(current);
        if (over) {
          setIsGameOver(true);
          recordGameResult('2048', newScore, { highestTile: maxTile });
        } else {
          // Record milestone update if high
          recordGameResult('2048', newScore, { highestTile: maxTile });
        }

        return current;
      }

      return prev;
    });
  }, [isGameOver, highestTile, score, hasWon, recordGameResult]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW') move('UP');
      if (e.code === 'ArrowDown' || e.code === 'KeyS') move('DOWN');
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') move('LEFT');
      if (e.code === 'ArrowRight' || e.code === 'KeyD') move('RIGHT');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // Touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        if (dx > 0) move('RIGHT');
        else move('LEFT');
      } else {
        if (dy > 0) move('DOWN');
        else move('UP');
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      
      {/* Header Info */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4 bg-[#141414] px-5 py-3 rounded-2xl border border-white/5">
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

      {/* Board Container */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative bg-[#0d0d0d] border border-white/10 rounded-2xl p-3 shadow-2xl overflow-hidden"
      >
        <div 
          className="grid grid-cols-4 gap-2.5 bg-[#171717] p-2.5 rounded-xl border border-white/5"
          style={{ width: 'min(340px, 80vw)', height: 'min(340px, 80vw)' }}
        >
          {board.flatMap((row, r) =>
            row.map((value, c) => {
              const tileStyle = TILE_COLORS[value] || { bg: 'bg-[#27272a]', text: 'text-white' };

              return (
                <div
                  key={`${r}-${c}`}
                  className={`rounded-xl flex items-center justify-center font-mono font-bold transition-all duration-100 ${
                    value === 0
                      ? 'bg-[#111] text-transparent'
                      : `${tileStyle.bg} ${tileStyle.text} ${tileStyle.glow || ''} scale-100 shadow-md`
                  }`}
                  style={{
                    fontSize: value > 512 ? '1.1rem' : value > 64 ? '1.3rem' : '1.5rem'
                  }}
                >
                  {value !== 0 ? value : ''}
                </div>
              );
            })
          )}
        </div>

        {/* Win / Game Over Overlay */}
        {(isGameOver || (hasWon && !isGameOver)) && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in duration-200">
            {hasWon && !isGameOver ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-white font-vazir">تبریک! به ۲۰۴۸ رسیدی! 🎉</h3>
                <p className="text-xs text-gray-300 font-vazir">میتوانی به بازی برای رکورد بالاتر ادامه دهی.</p>
                <div className="flex items-center gap-2 justify-center pt-2">
                  <button
                    onClick={() => setHasWon(false)}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl font-vazir"
                  >
                    ادامه بازی
                  </button>
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white text-xs rounded-xl font-vazir"
                  >
                    بازی جدید
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 font-bold text-lg font-mono">
                  ✕
                </div>
                <h3 className="text-lg font-extrabold text-white font-vazir">حرکت دیگری ممکن نیست!</h3>
                <p className="text-xs text-gray-300 font-vazir">
                  امتیاز نهایی: <span className="text-cyan-400 font-mono font-bold">{score}</span>
                </p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-black font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 mx-auto font-vazir transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>بازی جدید</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons & Touch Controls */}
      <div className="w-full max-w-sm mt-4 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetGame}
            className="px-4 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#222] border border-white/5 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors font-vazir"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازی جدید</span>
          </button>
        </div>

        {/* Mobile / Tablet Touch D-pad */}
        <div className="flex flex-col items-center gap-1 pt-1 sm:hidden">
          <button
            onClick={() => move('UP')}
            className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => move('LEFT')}
              className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => move('DOWN')}
              className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onClick={() => move('RIGHT')}
              className="w-12 h-12 rounded-xl bg-[#1c1c1c] active:bg-cyan-500/20 border border-white/10 flex items-center justify-center text-gray-300 active:text-cyan-400"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="hidden sm:block text-center text-[11px] text-gray-500 font-vazir pt-1">
          کلیدهای جهت‌نما / WASD برای ترکیب خانه‌ها
        </div>
      </div>

    </div>
  );
};
