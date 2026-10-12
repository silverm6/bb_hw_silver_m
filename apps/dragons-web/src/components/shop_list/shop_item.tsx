import type { ShopItem as ShopItemData } from 'dragons-api/types';

import { useGameStore } from '../../game/store';

import styles from './shop_list.module.css';

interface ShopItemProps {
  item: ShopItemData;
  disabled: boolean;
}

export function ShopItem({ item, disabled }: ShopItemProps) {
  const buyItem = useGameStore((state) => state.buyItem);

  return (
    <li className={styles.row}>
      <button type="button" aria-label={`Buy ${item.name}`} disabled={disabled} onClick={() => buyItem(item)}>
        Buy
      </button>
      <span>{item.name}</span>
      <span>{item.cost}g</span>
    </li>
  );
}
