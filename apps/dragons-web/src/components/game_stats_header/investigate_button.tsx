import { useGameStore } from '../../game/store';

export function InvestigateButton() {
  const investigateReputation = useGameStore((state) => state.investigateReputation);
  const isPending = useGameStore((state) => state.isPending);
  const gameInProgress = useGameStore((state) => state.current !== undefined && state.current.lives > 0);

  return (
    <button type="button" disabled={isPending || !gameInProgress} onClick={investigateReputation}>
      Investigate reputation
    </button>
  );
}
