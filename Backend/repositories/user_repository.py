from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User, Company


class AuthRepository:

    def create_company(self, db: Session, company: Company):
        db.add(company)
        db.flush()
        db.refresh(company)
        return company

    def get_company_by_name(self, db: Session, company_name: str):
        return (
            db.query(Company)
            .filter(Company.company_name == company_name)
            .first()
        )

    def create_user(self, db: Session, user: User):
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    def get_user_by_email(self, db: Session, email: str):
        return (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

    def get_user_by_employee_id(self, db: Session, employee_id: str):
        return (
            db.query(User)
            .filter(User.employee_id == employee_id)
            .first()
        )

    def get_user_by_login_id(self, db: Session, login_id: str):
        return (
            db.query(User)
            .filter(
                (User.email == login_id) |
                (User.employee_id == login_id)
            )
            .first()
        )

    def update_company_logo(
        self,
        db: Session,
        company: Company,
        logo_url: str
    ):
        company.logo_url = logo_url
        db.commit()
        db.refresh(company)
        return company

    def update_password(
        self,
        db: Session,
        user: User,
        new_password_hash: str
    ):
        user.password_hash = new_password_hash
        user.must_change_password = False

        db.commit()
        db.refresh(user)

        return user

    def delete_user(self, db: Session, user: User):
        db.delete(user)
        db.commit()