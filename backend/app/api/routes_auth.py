"""
Authentication Routes - Clean Code: Thin controllers with service delegation
Handles HTTP requests and delegates business logic to AuthenticationService
"""
from fastapi import APIRouter, Depends, Request, Response
from sqlmodel import Session

from ..db import get_session
from ..schemas.user import UserCreate, UserLogin, UserOut
from ..services.auth_service import AuthenticationService

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register_user(data: UserCreate, session: Session = Depends(get_session)) -> UserOut:
    """Register new user - Clean Code: Delegate to service layer"""
    return AuthenticationService.register_user(data, session)

@router.post("/login", response_model=UserOut)
def login_user(
    data: UserLogin,
    request: Request,
    session: Session = Depends(get_session)
) -> UserOut:
    """Login user - Clean Code: Delegate authentication to service"""
    return AuthenticationService.authenticate_user(data, request, session)

@router.post("/logout")
def logout_user(request: Request) -> dict:
    """Logout user - Clean Code: Simple delegation"""
    return AuthenticationService.logout_user(request)

@router.post("/change-password", response_model=UserOut)
def change_user_password(
    data: dict,
    request: Request,
    session: Session = Depends(get_session)
) -> UserOut:
    """Change user password - Clean Code: Extract data and delegate to service"""
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    
    return AuthenticationService.change_user_password(
        current_password, new_password, request, session
    )