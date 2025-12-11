import { useEffect, useState } from "react";

export default function TimingMiniGame({ onResult, multiplier, disabled }) {
  if (disabled) return null; // Evita fallos si ya no debe correr

  const [pos, setPos] = useState(0);
  const [dir, setDir] = useState(1);
  const [clicked, setClicked] = useState(false);
  const [reachedMax, setReachedMax] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((p) => {
        let next = p + dir * (2 * multiplier);

        // Cuando llega a la derecha
        if (next >= 100) {
          setReachedMax(true);
          setDir(-1);
          next = 100;
        }

        // Si vuelve a 0 y NO se presionó nada → perder ronda
        if (next <= 0) {
          if (reachedMax && !clicked) {
            onResult("fail"); // Solo pierde la ronda, no el juego
          }
          setDir(1);
          next = 0;
        }

        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [dir, multiplier, clicked, reachedMax, onResult]);

  function click() {
    setClicked(true);

    if (pos > 45 && pos < 55) onResult("perfect");
    else if (pos > 35 && pos < 65) onResult("good");
    else onResult("fail");
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <p>Golpea en el centro!</p>

      <div className="relative w-[250px] h-[22px] bg-neutral-800 border border-gray-400 overflow-hidden">

        <div className="absolute top-0 left-[45%] w-[10%] h-full bg-green-500/40"></div>

        <div
          className="absolute top-0 w-[5%] h-full bg-white"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        ></div>

      </div>

      <button
        className="px-4 py-2 bg-purple-500 rounded"
        onClick={click}
      >
        Golpear
      </button>

      <div className="text-sm mt-2 opacity-70">Velocidad actual: x{multiplier}</div>
    </div>
  );
}
