import { useWishlistStore } from "./useWishlistStore";

describe("Wishlist Store Unit Tests", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  it("لیست آرزوها باید خالی باشد", () => {
    const { items } = useWishlistStore.getState();
    expect(items.length).toBe(0);
  });

  it("باید بتواند کالا را به لیست آرزوها اضافه کند", () => {
    const { toggleItem } = useWishlistStore.getState();
    const mockProduct = { id: 1, title: "PS5 Pro", price: 499, image: "/test.jpg" };
    toggleItem(mockProduct);
    expect(useWishlistStore.getState().items.length).toBe(1);
    expect(useWishlistStore.getState().isInWishlist(1)).toBe(true);
    toggleItem(mockProduct);
    expect(useWishlistStore.getState().items.length).toBe(0);
    expect(useWishlistStore.getState().isInWishlist(1)).toBe(false);
  });
});