export const LOOT_BOX_REWARDS = [
  {
    key: "cyberpunk-key",
    image: "https://media.rawg.io/media/games/26d/26d4437715bee60138cb4a44dbe8bf2f.jpg",
    value: "$59.99",
  },
  {
    key: "rtx-pass",
    image: "https://dummyjson.com/image/150x150/404040/ffffff?text=RTX+PASS",
    value: "$29.99",
  },
  {
    key: "hardware-coupon",
    image: "/images/GiftCard.png",
    value: "$50.00",
  },
] as const;

export type LootBoxRewardKey = (typeof LOOT_BOX_REWARDS)[number]["key"];

export function isLootBoxRewardKey(value: string): value is LootBoxRewardKey {
  return LOOT_BOX_REWARDS.some((reward) => reward.key === value);
}
