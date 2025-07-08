"""
Regisztráció, bejelentkezés, kijelentkezés endpointok.
Session cookie-ban tárolja a user_id-t.
"""
from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from sqlmodel import Session, select

from ..db import get_session
from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserOut
from ..utils.password import hash_password, verify_password

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(data: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.username == data.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Felhasználónév foglalt.")
    user = User(
        username=data.username,
        password_hash=hash_password(data.password),
        must_change_password=False,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return UserOut(
        id=user.id if user.id is not None else 0,
        username=user.username,
        is_admin=user.is_admin,
        must_change_password=user.must_change_password,
    )

@router.post("/login", response_model=UserOut)
def login(
    data: UserLogin,
    request: Request,
    response: Response,
    session: Session = Depends(get_session)
):
    user = session.exec(select(User).where(User.username == data.username)).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Hibás felhasználónév vagy jelszó.")
    request.session["user_id"] = user.id
    return UserOut(
        id=user.id if user.id is not None else 0,
        username=user.username,
        is_admin=user.is_admin,
        must_change_password=user.must_change_password,
    )

@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Kijelentkeztél."}