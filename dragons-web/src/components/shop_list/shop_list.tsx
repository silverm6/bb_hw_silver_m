import type { ShopItem as ShopItemData } from 'dragons-api/types';

import { ShopItem } from './shop_item';

interface ShopListProps {
  items: ShopItemData[];
  gold?: number;
}

export function ShopList({ items, gold }: ShopListProps) {
  if (items.length === 0) {
    return <p>Shop is empty</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <ShopItem key={item.id} item={item} canAfford={gold !== undefined && gold >= item.cost} />
      ))}
    </ul>
  );
}
