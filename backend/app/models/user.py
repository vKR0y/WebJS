"""
Felhasználó modell SQLModel-lel.
"""
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True, nullable=False, max_length=32)
    password_hash: str = Field(nullable=False, max_length=128)
    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)
    otp_secret: Optional[str] = Field(default=None, max_length=32)
    must_change_password: bool = Field(default=False)  # ÚJ mező: első bejelentkezés után kötelező csere