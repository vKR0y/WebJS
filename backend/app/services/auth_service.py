"""
Authentication Service - Clean Code: Single Responsibility Principle
Handles user authentication, registration, and session management
"""

from typing import Optional, Tuple
from fastapi import HTTPException, Request, status
from sqlmodel import Session, select

from ..models.user import User
from ..schemas.user import UserCreate, UserLogin, UserOut
from ..utils.password import hash_password, verify_password
from ..utils.password_validation import validate_password_strength


class AuthenticationService:
    """Service for authentication operations following Clean Code principles"""
    
    @staticmethod
    def _convert_user_to_output(user: User) -> UserOut:
        """Convert User model to UserOut schema - DRY principle"""
        return UserOut(
            id=user.id if user.id is not None else 0,
            username=user.username,
            is_admin=user.is_admin,
            must_change_password=user.must_change_password,
        )
    
    @staticmethod
    def _validate_user_input(username: str, password: str) -> None:
        """Validate user input - Input validation separation"""
        if not username or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Felhasználónév és jelszó szükséges."
            )
    
    @staticmethod
    def _check_password_strength(password: str) -> None:
        """Check password strength - Single purpose validation"""
        is_valid, errors = validate_password_strength(password)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Gyenge jelszó: {', '.join(errors)}"
            )
    
    @classmethod
    def register_user(cls, data: UserCreate, session: Session) -> UserOut:
        """
        Register new user - Clear function name and single responsibility
        """
        # Check if username already exists
        existing = session.exec(select(User).where(User.username == data.username)).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Felhasználónév foglalt."
            )
        
        # Validate password strength
        cls._check_password_strength(data.password)
        
        # Create new user
        user = User(
            username=data.username,
            password_hash=hash_password(data.password),
            must_change_password=False,
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        
        return cls._convert_user_to_output(user)
    
    @classmethod
    def authenticate_user(cls, data: UserLogin, request: Request, session: Session) -> UserOut:
        """
        Authenticate user login - Clear purpose and error handling
        """
        # Find user by username
        user = session.exec(select(User).where(User.username == data.username)).first()
        
        # Verify credentials
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Hibás felhasználónév vagy jelszó."
            )
        
        # Set session
        request.session["user_id"] = user.id
        
        return cls._convert_user_to_output(user)
    
    @staticmethod
    def logout_user(request: Request) -> dict:
        """
        Logout user - Simple and clear
        """
        request.session.clear()
        return {"message": "Kijelentkeztél."}
    
    @staticmethod
    def get_current_user_from_session(request: Request, session: Session) -> User:
        """
        Get current user from session - Reusable helper
        """
        user_id = request.session.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Nem vagy bejelentkezve."
            )
        
        user = session.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Felhasználó nem található."
            )
        
        return user
    
    @classmethod
    def change_user_password(
        cls, 
        current_password: str, 
        new_password: str, 
        request: Request, 
        session: Session
    ) -> UserOut:
        """
        Change user password - Clear input parameters and validation
        """
        # Validate input
        if not current_password or not new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Jelenlegi és új jelszó szükséges."
            )
        
        # Get current user
        user = cls.get_current_user_from_session(request, session)
        
        # Verify current password
        if not verify_password(current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Hibás jelenlegi jelszó."
            )
        
        # Validate new password strength
        cls._check_password_strength(new_password)
        
        # Update password
        user.password_hash = hash_password(new_password)
        user.must_change_password = False
        session.add(user)
        session.commit()
        session.refresh(user)
        
        return cls._convert_user_to_output(user)