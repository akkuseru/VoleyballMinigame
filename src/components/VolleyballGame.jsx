import { useState } from "react";
import TimingMiniGame from "./TimingMiniGame";

export default function VolleyballGame() {
  const [ballPosition, setBallPosition] = useState("enemy");
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const [winner, setWinner] = useState(null);  
  const [playerScore, setPlayerScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const roundActive = winner === null;

  function resetRound() {
    setWinner(null);
    setSpeedMultiplier(1);
    setBallPosition("enemy");
    enemyServe();
  }

  function resetGame() {
    setBallPosition("enemy");
    setShowMiniGame(false);
    setSpeedMultiplier(1);
    setWinner(null);
    setPlayerScore(0);
    setEnemyScore(0);
    setGameOver(false);
  }

  function enemyServe() {
    setBallPosition("center");

    setTimeout(() => {
      setBallPosition("player");

      setTimeout(() => {
        setShowMiniGame(true);
      }, 600);
    }, 600);
  }

  function enemyResponse(playerPower) {
    let failChance = playerPower === "perfect" ? 0.7 : 0.4;

    if (Math.random() < failChance) {
      endRound("player");
      return;
    }

    const iaResult = Math.random() < 0.5 ? "perfect" : "good";

    if (iaResult === "perfect") {
      setSpeedMultiplier((prev) => Math.min(prev * 2, 16));
    }

    setBallPosition("center");

    setTimeout(() => {
      setBallPosition("player");
      setTimeout(() => setShowMiniGame(true), 600);
    }, 600);
  }

  function endRound(winnerSide) {
    setWinner(winnerSide);
    setSpeedMultiplier(1);

    if (winnerSide === "player") {
      setPlayerScore((prev) => {
        const newScore = prev + 1;
        if (newScore === 2) setGameOver(true);
        return newScore;
      });
    } else {
      setEnemyScore((prev) => {
        const newScore = prev + 1;
        if (newScore === 2) setGameOver(true);
        return newScore;
      });
    }
  }

  function handleMiniGameResult(res) {
    setShowMiniGame(false);

    // ❗ FAIL = perder RONDA, no el juego
    if (res === "fail") {
      if (!gameOver) endRound("enemy");
      return;
    }

    setBallPosition("center");

    setTimeout(() => {
      setBallPosition("enemy");

      setTimeout(() => {
        enemyResponse(res);
      }, 600);
    }, 600);
  }

  const ballLeft =
    ballPosition === "enemy"
      ? "0px"
      : ballPosition === "center"
      ? "140px"
      : "280px";

  return (
    <div className="w-full h-full flex flex-col items-center mt-6 text-white">

      <h2 className="text-3xl font-bold mb-1">🏐 Mini Voleibol</h2>
      <p className="text-gray-300 mb-4">Mejor de 3 rondas</p>

      <div className="flex gap-6 text-xl mb-4">
        <span className="text-green-400">Jugador: {playerScore}</span>
        <span className="text-red-400">Enemigo: {enemyScore}</span>
      </div>

      <div className="relative w-[300px] h-[100px] border border-white overflow-hidden">
        <div
          className="absolute top-[40px] transition-all duration-700 text-3xl"
          style={{ left: ballLeft }}
        >
          🏐
        </div>
      </div>

      {showMiniGame && !gameOver && (
        <TimingMiniGame
          multiplier={speedMultiplier}
          onResult={handleMiniGameResult}
          disabled={gameOver} // <-- Evita fail después de terminar
        />
      )}

      {!winner && !showMiniGame && !gameOver && (
        <button
          onClick={resetRound}
          className="mt-4 px-4 py-2 bg-blue-600 rounded"
        >
          Iniciar ronda
        </button>
      )}

      {winner && !gameOver && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-xl">
            {winner === "player" ? "¡Ganaste la ronda!" : "Perdiste la ronda"}
          </p>
          <button
            onClick={resetRound}
            className="px-4 py-2 bg-green-600 rounded"
          >
            Siguiente ronda
          </button>
        </div>
      )}

      {gameOver && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <p className="text-2xl font-bold">
            {playerScore > enemyScore ? "¡Ganaste el juego!" : "Perdiste el juego"}
          </p>

          <button
            onClick={resetGame}
            className="px-4 py-2 bg-yellow-600 rounded"
          >
            Reintentar juego
          </button>

          <button
            onClick={() => alert("Juego cerrado")}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Finalizar
          </button>
        </div>
      )}

    </div>
  );
}
