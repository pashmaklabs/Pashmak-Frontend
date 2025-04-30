import { create } from "zustand";

const useFocus = create((set) => ({
  focus: false,
  setFocus: (newFocus) => set({ focus: newFocus }),
}));

export { useFocus };
