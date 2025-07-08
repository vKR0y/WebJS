/**
 * Auth API wrapper – React frontend számára.
 * 
 * Ezek a függvények a FastAPI backend /auth végpontjaihoz küldenek kéréseket.
 * Tartalmaz: regisztráció, login, logout, jelszócsere (a későbbiekhez bővíthető),
 * valamint a válaszok és hibák egységes kezelését.
 *
 * A fetch mindenhol a credentials: "include" opcióval fut, hogy a session cookie működjön!
 */

export type UserOut = {
  id: number
  username: string
  is_admin: boolean
  must_change_password: boolean
}

// API szerver alap URL-je (dev/prod környezetben lehet változó)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000"

console.log("API_BASE URL:", API_BASE); // Debug log

/**
 * Regisztráció – új felhasználó létrehozása
 * @param username Felhasználónév
 * @param password Jelszó
 * @returns UserOut (backendetől)
 */
export async function register(username: string, password: string): Promise<UserOut> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    credentials: "include", // FONTOS: session cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    // Hibák kezelése
    const error = await res.json().catch(() => ({}))
    throw new Error(error.detail || "Ismeretlen hiba regisztrációkor")
  }
  return await res.json()
}

/**
 * Bejelentkezés – session cookie-t kap a böngésző
 * @param username Felhasználónév
 * @param password Jelszó
 * @returns UserOut (must_change_password flag-gel)
 */
export async function login(username: string, password: string): Promise<UserOut> {
  console.log("Login kísérlet:", { username, apiUrl: `${API_BASE}/auth/login` });
  
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  
  console.log("Login válasz státusz:", res.status);
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    console.error("Login hiba:", error);
    throw new Error(error.detail || "Hibás felhasználónév vagy jelszó")
  }
  
  const userData = await res.json()
  console.log("Sikeres login:", userData);
  return userData
}

/**
 * Kijelentkezés – session törlése
 */
export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })
  if (!res.ok) {
    throw new Error("Sikertelen kijelentkezés")
  }
}

/**
 * (Későbbi bővítéshez: jelszócsere, user info lekérés, 2FA setup stb.)
 */