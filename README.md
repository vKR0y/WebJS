# WebJS# - Auth rendszer (React + FastAPI)

## Áttekintés

Ez a projekt egy modern, biztonságos bejelentkeztető és adminisztrációs felületet valósít meg, amely React frontendből és FastAPI backendből áll.  
A rendszer session-alapú authentikációt használ, bcrypt jelszóhash-elést, Google Authenticator-alapú 2FA-t, CSRF-védelmet, valamint háttéranimációt biztosít minden oldalon.  

A backend Gunicorn+Uvicorn workerrel, reverse proxy mögött fut.  
Az adatok fejlesztés alatt SQLite-ban, éles környezetben MSSQL-ben (vagy más, ODBC-kompatibilis RDBMS-ben) tárolódnak.

---

## Főkoncepciók

- **Frontend:** React (Vite vagy Create React App) + TypeScript, session cookie kezeléssel, REST API hívásokkal.
- **Backend:** FastAPI (Python 3.11+), session middleware, bcrypt, pyotp, csrf védelem, SQLModel/SQLAlchemy ORM.
- **Adatbázis:** SQLite (dev), MSSQL (éles).
- **Reverse Proxy:** Nginx + Cloudflare SSL, backend HTTP-n.
- **Animáció:** Canvas alapú, külön komponens, mindig háttérben (login/admin/settings oldalakon is).

---

## Projektstruktúra

```
vkr0y-auth/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI entry, app factory
│   │   ├── config.py             # Környezeti beállítások, secret-ek, env-kezelés
│   │   ├── db.py                 # DB inicializáció, session management
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py           # User ORM/SQLModel, jelszó, 2FA, státuszok
│   │   │   └── ...               
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py           # Pydantic sémák API-hoz
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # Auth, jelszó reset, 2FA logika
│   │   │   ├── user.py           # User management (CRUD)
│   │   │   └── ...
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── routes_auth.py    # Auth: login, logout, password change, 2FA
│   │   │   ├── routes_user.py    # User admin (csak admin számára elérhető)
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── __init__.py
│   │   │   ├── session.py        # Session/cookie kezelés
│   │   │   ├── csrf.py           # CSRF protection
│   │   │   └── ...
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── password.py       # Jelszó validáció, hash, policy
│   │       ├── 2fa.py            # PyOTP helper, QR generálás
│   │       └── ...
│   ├── tests/                    # Backend unit/integration tesztek
│   ├── requirements.txt
│   └── gunicorn_conf.py          # Gunicorn config (workers, bind, log, stb.)
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── ...
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── api/                  # API wrapper (fetch/axios)
│   │   │   └── auth.ts
│   │   ├── components/
│   │   │   ├── BackgroundCanvas.tsx    # Háttér animáció
│   │   │   ├── LoginForm.tsx
│   │   │   ├── PasswordChangeForm.tsx
│   │   │   ├── TwoFASetup.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.tsx         # Auth state, User info, session
│   │   ├── styles/
│   │   │   ├── main.css
│   │   │   └── ...
│   │   └── utils/
│   │       └── passwordPolicy.ts
│   ├── package.json
│   └── vite.config.ts / CRA config
│
├── nginx/
│   ├── default.conf.sample         # Példa nginx config (proxy, ssl termination)
│   └── README.md
│
├── .env.example                    # Környezeti változók (titkos kulcsok, DB URL)
├── README.md                       # Ez a leírás
└── docker-compose.yml              # (opcionális, dev stackhez)
```

---

## Magyarázat, szervezési elv

### **Backend**

- **app/main.py:** FastAPI entrypoint, app factory (middleware, route regisztráció).
- **config.py:** Környezeti beállítások (pl. SECRET_KEY, DB_URL).
- **db.py:** Adatbázis kapcsolódás, session dependency.
- **models/**: ORM modellek (User, esetleg AuditLog, stb.)
- **schemas/**: Pydantic sémák (input/output API-hoz).
- **services/**: Üzleti logika, minden, ami nem direkt endpoint vagy modell.
- **api/**: Route-ok, endpointok szétválasztva (auth, user, stb.).
- **middleware/**: Saját session/csrf middleware-ek, ha beépített nem elég.
- **utils/**: Segédfüggvények (jelszó policy, 2FA util).
- **tests/**: Backend tesztek.
- **requirements.txt:** Python dependency-k.
- **gunicorn_conf.py:** Gunicorn worker config (async, uvicorn worker class).

### **Frontend**

- **public/index.html:** Gyökér HTML (React mount point).
- **src/api/**: Backend API wrapper (fetch/axios, error handling).
- **src/components/**: Újrafelhasználható komponensek (formok, háttér, stb.).
- **src/pages/**: Oldalak, route-onként (login, beállítások, admin, stb.).
- **src/context/**: Auth context, user session, global state.
- **src/styles/**: CSS/SCSS fájlok.
- **src/utils/**: Frontend segédfüggvények (pl. password policy validátor).
- **package.json, vite.config.ts:** Build tool, dependency-k.

### **Egyéb**

- **nginx/**: Példakonfiguráció reverse proxy-hoz.
- **.env.example:** Példa környezeti változókhoz (soha ne committold az éles .env-et!).
- **docker-compose.yml:** Fejlesztési stackhez, ha szükséges.

---

## Fejlesztési workflow

1. **Backend**:  
   - `uvicorn app.main:app --reload` (dev)
   - `gunicorn -k uvicorn.workers.UvicornWorker app.main:app` (prod)
2. **Frontend**:  
   - `npm run dev` (Vite/Cra)
   - Build: `npm run build` → statikus fájlok nginx-be
3. **Nginx/Cloudflare**:  
   - SSL termination, proxy, subdomain routing.
4. **Első user**:  
   - Default: admin/admin, forced password + 2FA setup.

---

## Bővítés/leágazás

- **Prod DB**: MSSQL-re váltás minimális módosítással (SQLAlchemy/SQLModel támogatja).
- **További autentikációs módok** (pl. SSO, LDAP) később hozzáadhatók.
- **Auditlog**: minden user/admin akció logolható.
- **Külső API/jövőbeli mobil kliens**: JWT bevezethető, ha szükséges.

---

## Kódminőség

- **Clean Code**: minden réteg jól elkülönül, tesztelhető.
- **Frontend/Backend tesztek**: pytests, jest/react-testing-library.
- **Kódgenerálás, openapi**: FastAPI automatikusan doksit generál.

---
