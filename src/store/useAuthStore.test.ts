import { useAuthStore } from "./useAuthStore";

describe("Auth Store Unit Tests", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      registeredAccount: null,
    });
  });

  it("باید نشست (Session) خالی باشد", () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  it("باید بتواند کاربر را وارد کند", () => {
    const { login } = useAuthStore.getState();

    login({
      name: "Farzad",
      username: "ShadowHunter99",
      email: "demo@voidloot.com",
      avatar: "/avatar.jpg",
      level: 5,
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.name).toBe("Farzad");
    expect(state.user?.level).toBe(5);
  });

  it("باید بتواند کاربر را خارج کند", () => {
    const { login, logout } = useAuthStore.getState();
    login({
      name: "Farzad",
      username: "ShadowHunter99",
      email: "demo@voidloot.com",
      avatar: "/avatar.jpg",
      level: 5,
    });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  it("باید بتواند کاربر را به روز رسانی کند", () => {
    const { login, updateProfile } = useAuthStore.getState();
    login({
      name: "Farzad",
      username: "OldName",
      email: "demo@voidloot.com",
      avatar: "/old.jpg",
      level: 5,
    });

    updateProfile({
      name: "Farzad",
      username: "VoidMaster",
      avatar: "/new.jpg",
      banner: "/banner.jpg",
    });

    const state = useAuthStore.getState();
    expect(state.user?.username).toBe("VoidMaster");
    expect(state.user?.avatar).toBe("/new.jpg");
    expect(state.user?.banner).toBe("/banner.jpg");
  });
});
