"""
Adatbázis inicializáció, session dependency, admin user létrehozás.
"""

from sqlmodel import SQLModel, create_engine, Session, select
from .config import settings
from .models.user import User
from .utils.password import hash_password

engine = create_engine(settings.DB_URL, echo=True)

def init_db():
    """
    Létrehozza a táblákat, és ha nincs felhasználó, létrehozza az admin/admin usert (must_change_password=True).
    """
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        # Van már user?
        user_count = session.exec(select(User)).first()
        if not user_count:
            admin = User(
                username="admin",
                password_hash=hash_password("admin"),
                is_admin=True,
                is_active=True,
                must_change_password=True,  # kötelező első jelszócsere
            )
            session.add(admin)
            session.commit()
            print("Létrehozva az első admin user: admin/admin (kötelező első jelszócsere)")
        else:
            print("Felhasználók már léteznek, nem hozok létre új admin-t.")

def get_session():
    with Session(engine) as session:
        yield session