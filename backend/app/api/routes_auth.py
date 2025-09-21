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
from ..utils.password_validation import validate_password_strength

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(data: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.username == data.username)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Felhasználónév foglalt.")
    
    # Jelszó erősség ellenőrzése
    is_valid, errors = validate_password_strength(data.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"Gyenge jelszó: {', '.join(errors)}")
    
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

@router.post("/change-password", response_model=UserOut)
def change_password(
    data: dict,
    request: Request,
    session: Session = Depends(get_session)
):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Nem vagy bejelentkezve.")
    
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Felhasználó nem található.")
    
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    
    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="Jelenlegi és új jelszó szükséges.")
    
    if not verify_password(current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Hibás jelenlegi jelszó.")
    
    # Új jelszó erősség ellenőrzése
    is_valid, errors = validate_password_strength(new_password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"Gyenge új jelszó: {', '.join(errors)}")
    
    # Jelszó frissítése
    user.password_hash = hash_password(new_password)
    user.must_change_password = False
    session.add(user)
    session.commit()
    session.refresh(user)
    
    return UserOut(
        id=user.id if user.id is not None else 0,
        username=user.username,
        is_admin=user.is_admin,
        must_change_password=user.must_change_password,
    )