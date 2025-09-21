import React, { useRef, useState, useEffect } from "react";
import { login, changePassword } from "../api/auth";
import { validatePasswordStrength, isPasswordStrong } from "../utils/passwordValidation";
import "../styles/LoginForm.css";

type Step = "username" | "password" | "change-password" | "new-password" | "done" | "hidden";

const placeholder1 = "Who's that?";
const placeholder2 = "Hy!";
const placeholder3 = "Current password";
const placeholder4 = "New password";
const maxInputWidth = 400;

// Szélességmérés segédfüggvény
function measureTextWidth(text: string, font: string): number {
  const canvas =
    measureTextWidth.canvas ||
    (measureTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  if (!context) return 150;
  context.font = font;
  return context.measureText(text).width;
}
measureTextWidth.canvas = undefined as HTMLCanvasElement | undefined;

const LoginForm: React.FC<{ onLoginSuccess: (user: any) => void }> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<Step>("hidden");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [inputWidth, setInputWidth] = useState<number>();
  const [minWidth, setMinWidth] = useState<number>();
  const [fadeClass, setFadeClass] = useState(""); // "active", "leaving", ""
  const centerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inactiveBoxRef = useRef<HTMLDivElement>(null); // inaktív box

  // Dinamikus input szélesség és minWidth (helyes placeholder-mérés)
  useEffect(() => {
    let value = "";
    let placeholder = "";
    if (step === "username") {
      value = username;
      placeholder = placeholder1;
    } else if (step === "password") {
      value = password;
      placeholder = placeholder2;
    } else if (step === "change-password") {
      value = currentPassword;
      placeholder = placeholder3;
    } else if (step === "new-password") {
      value = newPassword;
      placeholder = placeholder4;
    }
    // Vegye az input aktuális fontját, vagy fallback
    let font = "1.15em 'Segoe UI', Monospace, sans-serif";
    if (inputRef.current) {
      const style = window.getComputedStyle(inputRef.current);
      font = `${style.fontSize} ${style.fontFamily}`;
    }
    // Placeholder minWidth számolás (padding: 1.1em bal+jobb)
    const plWidth = measureTextWidth(placeholder, font) + 50; // padding-bal/jobb kb. 18+18px
    setMinWidth(plWidth);
    // Aktuális input szélesség
    const w = Math.max(
      plWidth,
      Math.min(measureTextWidth(value, font) + 50, maxInputWidth)
    );
    setInputWidth(w);
    // eslint-disable-next-line
  }, [username, password, currentPassword, newPassword, step]);

  // Fókusz inputra step váltáskor
  useEffect(() => {
    if (step === "username" || step === "password" || step === "change-password" || step === "new-password") {
      setTimeout(() => inputRef.current?.focus(), 80);
      // Jelszó követelmények megjelenítése új jelszó beírásakor
      setShowPasswordRequirements(step === "new-password");
    }
  }, [step]);

  // ESC: resetel
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        fadeOutAndReset();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line
  }, []);

  // Kattintásfigyelő
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!centerRef.current) return;
      if (
        inactiveBoxRef.current &&
        inactiveBoxRef.current.contains(e.target as Node)
      )
        return;

      if (centerRef.current.contains(e.target as Node)) {
        if (step === "hidden") {
          setFadeClass("active");
          setStep("username");
        }
      } else {
        fadeOutAndReset();
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
    // eslint-disable-next-line
  }, [step]);

  // Eltűnés animáció
  function fadeOutAndReset() {
    setFadeClass("leaving");
    setTimeout(() => {
      setUsername("");
      setPassword("");
      setCurrentPassword("");
      setNewPassword("");
      setError("");
      setUser(null);
      setIsLoading(false);
      setShowPasswordRequirements(false);
      setStep("hidden");
      setFadeClass("");
    }, 480); // Animáció időtartama (CSS-ben is ennyi!)
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (step === "username") {
        if (username.trim().length < 3) {
          setError("Legalább 3 karakter szükséges.");
          return;
        }
        setError("");
        setStep("password");
      } else if (step === "password") {
        handleLogin();
      } else if (step === "change-password") {
        if (currentPassword.length < 4) {
          setError("Jelenlegi jelszó minimum 4 karakter.");
          return;
        }
        setError("");
        setStep("new-password");
      } else if (step === "new-password") {
        if (!isPasswordStrong(newPassword)) {
          setError("A jelszó nem felel meg az erősségi követelményeknek.");
          return;
        }
        handleChangePassword();
      }
    }
  }

  async function handleLogin() {
    if (password.length < 4) {
      setError("A jelszó minimum 4 karakter.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const userData = await login(username, password);
      setUser(userData);
      
      if (userData.must_change_password) {
        setStep("change-password");
        setIsLoading(false);
      } else {
        setStep("done");
        console.log("Sikeres bejelentkezés:", userData);
        setTimeout(() => {
          onLoginSuccess(userData);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Bejelentkezési hiba");
      setIsLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!isPasswordStrong(newPassword)) {
      setError("A jelszó nem felel meg az erősségi követelményeknek.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const userData = await changePassword(currentPassword, newPassword);
      setUser(userData);
      setStep("done");
      console.log("Sikeres jelszó csere:", userData);
      setTimeout(() => {
        onLoginSuccess(userData);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Jelszó csere sikertelen");
      setIsLoading(false);
    }
  }

  // Fadewrap osztályok: "active", "leaving", "" (rejtett)
  const fadeWrapClass =
    step !== "hidden"
      ? `login-form-fadewrap ${fadeClass} ${step}`
      : "login-form-fadewrap";

  return (
    <div ref={centerRef} className="login-form-centerarea">
      <div ref={inactiveBoxRef} className="login-form-inactivebox"></div>
      <div className={fadeWrapClass}>
        {step === "username" && (
          <input
            ref={inputRef}
            className={`login-form-input${error ? " error" : ""}`}
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder1}
            spellCheck={false}
            tabIndex={0}
            style={{
              width: inputWidth ? `${inputWidth}px` : undefined,
              minWidth: minWidth ? `${minWidth}px` : undefined,
              maxWidth: `${maxInputWidth}px`,
              transition: "width 0.35s cubic-bezier(.6,0,.22,1)",
            }}
          />
        )}
        {step === "password" && (
          <input
            ref={inputRef}
            className={`login-form-input${error ? " error" : ""}`}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder2}
            disabled={isLoading}
            tabIndex={0}
            style={{
              width: inputWidth ? `${inputWidth}px` : undefined,
              minWidth: minWidth ? `${minWidth}px` : undefined,
              maxWidth: `${maxInputWidth}px`,
              transition: "width 0.35s cubic-bezier(.6,0,.22,1)",
            }}
          />
        )}
        {step === "change-password" && (
          <input
            ref={inputRef}
            className={`login-form-input${error ? " error" : ""}`}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder3}
            disabled={isLoading}
            tabIndex={0}
            style={{
              width: inputWidth ? `${inputWidth}px` : undefined,
              minWidth: minWidth ? `${minWidth}px` : undefined,
              maxWidth: `${maxInputWidth}px`,
              transition: "width 0.35s cubic-bezier(.6,0,.22,1)",
            }}
          />
        )}
        {step === "new-password" && (
          <input
            ref={inputRef}
            className={`login-form-input${error ? " error" : ""}`}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder4}
            disabled={isLoading}
            tabIndex={0}
            style={{
              width: inputWidth ? `${inputWidth}px` : undefined,
              minWidth: minWidth ? `${minWidth}px` : undefined,
              maxWidth: `${maxInputWidth}px`,
              transition: "width 0.35s cubic-bezier(.6,0,.22,1)",
            }}
          />
        )}
        {isLoading && <div className="login-form-loading">
          {step === "change-password" || step === "new-password" ? "Jelszó csere..." : "Bejelentkezés..."}
        </div>}
        {error && <div className="login-form-error">{error}</div>}
        {step === "change-password" && !isLoading && (
          <div className="login-form-info">⚠ Kötelező jelszó csere - Add meg a jelenlegi jelszót</div>
        )}
        {step === "new-password" && !isLoading && (
          <div className="login-form-info">🔑 Add meg az új jelszót</div>
        )}
        {showPasswordRequirements && step === "new-password" && (
          <div className="password-requirements">
            <div className="requirements-title">Jelszó követelmények:</div>
            {validatePasswordStrength(newPassword).map((req, index) => (
              <div key={index} className={`requirement ${req.met ? 'met' : 'unmet'}`}>
                {req.met ? '✓' : '○'} {req.text}
              </div>
            ))}
          </div>
        )}
        {step === "done" && user && (
          <div className="login-form-success">
            ✔ {user.must_change_password ? "Jelszó sikeresen megváltoztatva!" : `Üdvözlet, ${user.username}!`}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
