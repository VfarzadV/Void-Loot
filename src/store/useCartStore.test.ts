import { useCartStore } from "./useCartStore";

describe("Cart Store Unit Tests", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: false, activityLog: [] });
  });

  it("سبد خرید باید خالی باشد", () => {
    const { items } = useCartStore.getState();
    expect(items.length).toBe(0);
  });

  it("باید بتواند کالا را به سبد خرید اضافه کند", () => {
    const { addItem } = useCartStore.getState();
    addItem({
      id: 1,
      title: "Cyberpunk 2077",
      price: 59.99,
      image: "/test.jpg",
    });

    const { items } = useCartStore.getState();
    expect(items.length).toBe(1);
    expect(items[0].title).toBe("Cyberpunk 2077");
    expect(items[0].quantity).toBe(1);
  });

  it("باید بتواند کالا را از سبد خرید حذف کند", () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem({ id: 1, title: "Elden Ring", price: 49.99, image: "/test.jpg" });
    clearCart();
    const { items } = useCartStore.getState();
    expect(items.length).toBe(0);
  });
});
