"""
Jelszó hash-elés és ellenőrzés bcrypt-tel.
"""

import bcrypt

def hash_password(raw_password: str) -> str:
    # Jelszóból bcrypt hash készítése
    return bcrypt.hashpw(raw_password.encode(), bcrypt.gensalt()).decode()

def verify_password(raw_password: str, hashed: str) -> bool:
    # Jelszó ellenőrzése a hash-hez képest
    return bcrypt.checkpw(raw_password.encode(), hashed.encode())