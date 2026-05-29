import { create } from "zustand";

const useFocus = create((set) => ({
  focus: false,
  setFocus: (newFocus) => set({ focus: newFocus }),
}));

const useInput = create((set) => ({
  input: "جست و جو",
  setInput: (newInput) => set({ input: newInput }),
}));

export { useFocus, useInput };
