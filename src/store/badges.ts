import { create } from "zustand";

type BadgeState = {
  badges: Record<string, number>; // routeName -> count
  setTabBadge: (routeName: string, count: number) => void;
  clearTabBadge: (routeName: string) => void;
  resetBadges: () => void;
};

export const useBadgeStore = create<BadgeState>((set) => ({
  badges: {},
  setTabBadge: (routeName, count) =>
    set((s) => ({ badges: { ...s.badges, [routeName]: Math.max(0, count) } })),
  clearTabBadge: (routeName) =>
    set((s) => {
      const next = { ...s.badges };
      delete next[routeName];
      return { badges: next };
    }),
  resetBadges: () => set({ badges: {} }),
}));
