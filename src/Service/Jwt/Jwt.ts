import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // exp is in SECONDS → Date.now() is in MILLISECONDS
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // expired → clear storage
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch {
    return false;
  }
};