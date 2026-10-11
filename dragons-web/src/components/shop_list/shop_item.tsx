import type { ShopItem as ShopItemData } from 'dragons-api/types';

interface ShopItemProps {
  item: ShopItemData;
  canAfford: boolean;
}

export function ShopItem({ item, canAfford }: ShopItemProps) {
  return (
    <li>
      <span>{item.name}</span>
      <span>{item.cost}g</span>
      <button type="button" disabled={!canAfford}>
        Buy
      </button>
    </li>
  );
}
