import { useState, useEffect, useRef, useCallback } from "react";

// Explicitly type the DATA object
const DATA: Record<number, string[]> = {
  1: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ", "अं", "अः"],
  2: ["क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ", "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह"],
  3: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
};

const GRID = 20;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<number[][]>([[5, 5]]);
  const [food, setFood] = useState<number[]>([10, 10]);
  const [dir, setDir] = useState<number[]>([0, 1]);
  const [stage, setStage] = useState<number>(1);
  const [idx, setIdx] = useState<number>(0);
  const [steps, setSteps] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(true);
  const [lang, setLang] = useState<string>("ne-NP");
  
  const touchStart = useRef({ x: 0, y: 0 });
  const currentTarget = useRef<string>(DATA[1][0]);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const resetGame = useCallback(() => {
    setSnake([[5, 5]]);
    setDir([0, 1]);
    setSteps(0);
    setIdx(0);
    setPaused(true);
    speak(lang === "ne-NP" ? "खेल सकियो" : "Game Over");
  }, [lang]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = [prev[0][0] + dir[0], prev[0][1] + dir[1]];
        if (head[0] < 0 || head[0] >= GRID || head[1] < 0 || head[1] >= GRID) {
          resetGame();
          return [[5, 5]];
        }
        setSteps((s) => s + 1);
        const next = [head, ...prev];
        if (head[0] === food[0] && head[1] === food[1]) {
          speak(currentTarget.current);
          const nextIdx = (idx + 1) % DATA[stage].length;
          setIdx(nextIdx);
          currentTarget.current = DATA[stage][nextIdx];
          setFood([Math.floor(Math.random() * GRID), Math.floor(Math.random() * GRID)]);
        } else {
          next.pop();
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [paused, dir, stage, idx, resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 400, 400);
    
    snake.forEach(([x, y], i) => {
      const hue = (i * 20 + steps * 2) % 360;
      ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
      ctx.fillRect(x * 20 + 1, y * 20 + 1, 18, 18);
    });
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px Arial";
    ctx.fillText(currentTarget.current, food[0] * 20 + 2, food[1] * 20 + 17);
  }, [snake, food, stage, idx, steps]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      {showModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6 text-center">
          <div className="bg-slate-900 border-2 border-emerald-500 p-8 rounded-xl max-w-sm">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6">Choose Language / भाषा छान्नुहोस्</h2>
            <div className="flex flex-col gap-3">
              {[
                { l: 'ne-NP', n: 'नेपाली' }, 
                { l: 'hi-IN', n: 'हिन्दी (India)' }, 
                { l: 'en-US', n: 'English' }
              ].map((o) => (
                <button 
                  key={o.l} 
                  onClick={() => { setLang(o.l); setShowModal(false); setPaused(false); }} 
                  className="bg-slate-700 py-3 rounded-lg font-bold hover:bg-emerald-600"
                >
                  {o.n}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <h1 className="text-xl font-bold text-emerald-400">SNAKE GAME</h1>
      <div className="text-amber-400 font-mono mb-2">Target: {currentTarget.current} | Steps: {steps}</div>
      
      <canvas 
        ref={canvasRef} width={400} height={400}
        className="border-4 border-slate-700 bg-slate-900 rounded-lg touch-none w-[90vw] max-w-[400px]"
        onTouchStart={(e) => touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStart.current.x;
          const dy = e.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > Math.abs(dy)) setDir([dx > 0 ? 1 : -1, 0]);
          else setDir([0, dy > 0 ? 1 : -1]);
        }}
      />

      <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-[250px]">
        <div /> <button onClick={() => setDir([0, -1])} className="p-4 bg-slate-700 rounded-lg">UP</button> <div />
        <button onClick={() => setDir([-1, 0])} className="p-4 bg-slate-700 rounded-lg">LEFT</button>
        <button onClick={() => setPaused(!paused)} className="p-4 bg-emerald-600 rounded-lg font-bold">PLAY/PAUSE</button>
        <button onClick={() => setDir([1, 0])} className="p-4 bg-slate-700 rounded-lg">RIGHT</button>
        <div /> <button onClick={() => setDir([0, 1])} className="p-4 bg-slate-700 rounded-lg">DOWN</button> <div />
      </div>

      <button onClick={() => setStage((s) => (s % 3) + 1)} className="mt-4 px-6 py-2 bg-purple-700 rounded-lg">Change Stage</button>
    </div>
  );
}
