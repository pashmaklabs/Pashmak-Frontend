import Cookies from "js-cookie";
import { AUTHORIZED_SEMANTIC_SEARCH_EMAILS } from "./constants";

export const getUserLogin = () => {
  return Cookies.get("pashmak_authentication") || null;
};

export const setUserLogin = (token) => {
  Cookies.set("pashmak_authentication", token);
};

export const removeUserLogin = () => {
  Cookies.remove("pashmak_authentication");
};

export const isUserLoggedIn = () => {
  return !!Cookies.get("pashmak_authentication");
};

export const hasSemanticSearchAccess = (email) => {
  return AUTHORIZED_SEMANTIC_SEARCH_EMAILS .includes(email);
};