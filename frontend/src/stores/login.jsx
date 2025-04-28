import { create } from "zustand";
import Cookies from "js-cookie";

const useLoginStep = create((set) => ({
  step: "email",
  setStep: (newStep) => set({ step: newStep }),
}));

const useEmail = create((set) => ({
  email: "",
  setEmail: (newEmail) => set({ email: newEmail }),
}));

const useUserLogin = create((set) => ({
  userLogin: Cookies.get("pashmak_authentication"),
  setUserLogin: (newUserLogin) => set({ userLogin: newUserLogin }),
}));

export { useLoginStep, useEmail, useUserLogin };
