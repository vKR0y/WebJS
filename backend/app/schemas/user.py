"""
Pydantic sémák: API input/output validációhoz (login, regisztráció, user info).
"""
from pydantic import BaseModel, constr

class UserCreate(BaseModel):
    username: constr(min_length=3, max_length=32)
    password: constr(min_length=4, max_length=64)

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    is_admin: bool
    must_change_password: bool  # ÚJ mező: frontend látja, hogy kötelező-e csere