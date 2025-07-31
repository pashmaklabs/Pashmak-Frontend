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

const useLoginStartPath = create((set) => ({
  loginStartPath: "",
  setLoginStartPath: (newLoginStartPath) =>
    set({ loginStartPath: newLoginStartPath }),
}));

const useUserLogin = create((set) => ({
  userLogin: Cookies.get("pashmak_authentication"),
  setUserLogin: (newUserLogin) => set({ userLogin: newUserLogin }),
}));

const useRole = create((set) => ({
  role: Cookies.get("role"),
  setRole: (newRole) => set({ role: newRole }),
}));

export { useLoginStep, useEmail, useUserLogin, useRole, useLoginStartPath };
