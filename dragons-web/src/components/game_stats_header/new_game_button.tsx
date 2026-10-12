import { useGameStore } from '../../game/store';

export function NewGameButton() {
  const startGame = useGameStore((state) => state.startGame);
  const isPending = useGameStore((state) => state.isPending);
  const gameInProgress = useGameStore((state) => state.current !== undefined);

  return (
    <button type="button" disabled={isPending} onClick={startGame}>
      {gameInProgress ? 'New game' : 'Start game'}
    </button>
  );
}
