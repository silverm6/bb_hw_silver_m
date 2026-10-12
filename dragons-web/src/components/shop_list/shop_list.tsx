import { useGameStore } from '../../game/store';
import { ShopItem } from './shop_item';

import styles from './shop_list.module.css';

export function ShopList() {
  const items = useGameStore((state) => state.shopItems);
  const gold = useGameStore((state) => state.current?.gold)!;
  const isPending = useGameStore((state) => state.isPending);
  const isGameOver = useGameStore((state) => (state.current?.lives ?? 0) <= 0);

  if (items.length === 0) {
    return <p>Shop is empty</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => {
        const canAfford = gold >= item.cost;

        return <ShopItem key={item.id} item={item} disabled={isPending || isGameOver || !canAfford} />;
      })}
    </ul>
  );
}
