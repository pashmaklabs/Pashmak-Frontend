import { create } from "zustand";

const useFocusedInputStore = create((set) => ({
  focusedInput: null,
  setFocusedInput: (input) => set({ focusedInput: input }),
}));

const usePrevRouteStore = create((set) => ({
  previousRoute: null, 
  setPreviousRoute: (route) => set({ previousRoute: route }), 
  clearPreviousRoute: () => set({ previousRoute: null }), 
}));

export { useFocusedInputStore, usePrevRouteStore };