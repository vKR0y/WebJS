"""
Jelszó validációs függvények.
"""

import re
from typing import List

def validate_password_strength(password: str) -> tuple[bool, List[str]]:
    """
    Ellenőrzi a jelszó erősségét.
    
    Követelmények:
    - Minimum 8 karakter
    - Legalább 1 kisbetű
    - Legalább 1 nagybetű
    - Legalább 1 szám
    - Legalább 1 speciális karakter
    
    Returns:
        tuple: (valid: bool, errors: List[str])
    """
    errors = []
    
    if len(password) < 8:
        errors.append("Minimum 8 karakter szükséges")
    
    if not re.search(r'[a-z]', password):
        errors.append("Legalább 1 kisbetű szükséges")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Legalább 1 nagybetű szükséges")
    
    if not re.search(r'\d', password):
        errors.append("Legalább 1 szám szükséges")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Legalább 1 speciális karakter szükséges (!@#$%^&*(),.?\":{}|<>)")
    
    return len(errors) == 0, errors

def get_password_requirements() -> List[str]:
    """
    Visszaadja a jelszó követelményeket lista formában.
    """
    return [
        "Minimum 8 karakter",
        "Legalább 1 kisbetű (a-z)",
        "Legalább 1 nagybetű (A-Z)",
        "Legalább 1 szám (0-9)",
        "Legalább 1 speciális karakter (!@#$%^&*(),.?\":{}|<>)"
    ]
