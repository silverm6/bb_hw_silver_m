interface NewGameButtonProps {
  hasGame: boolean;
}

export function NewGameButton({ hasGame }: NewGameButtonProps) {
  return <button type="button">{hasGame ? 'New game' : 'Start game'}</button>;
}
