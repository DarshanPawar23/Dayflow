from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User


class EmployeeRepository:

    def create_employee(self, db: Session, employee: User):
        db.add(employee)
        db.commit()
        db.refresh(employee)
        return employee

    def get_employee_by_email(self, db: Session, email: str):
        return (
            db.query(User)
            .filter(
                User.email == email
            )
            .first()
        )

    def get_employee_by_id(self, db: Session, employee_id: str):
        return (
            db.query(User)
            .filter(
                User.employee_id == employee_id
            )
            .first()
        )

    def get_employees_by_company(
        self,
        db: Session,
        company_id: int
    ):
        return (
            db.query(User)
            .filter(
                User.company_id == company_id,
                User.role == "EMPLOYEE"
            )
            .all()
        )