from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User


class EmployeeManagementRepository:
    """
    Repository layer for employee management.

    Handles all database operations related to employees.
    Business logic and authorization should remain in the service layer.
    """

    # ============================================================
    # GET ALL EMPLOYEES
    # ============================================================

    def get_all_employees(
        self,
        db: Session,
        company_id: int
    ):
        """
        Get all employees belonging to a specific company.
        """

        return (
            db.query(User)
            .filter(
                User.company_id == company_id,
                User.role == "EMPLOYEE"
            )
            .order_by(User.id.desc())
            .all()
        )

    # ============================================================
    # GET EMPLOYEE BY ID
    # ============================================================

    def get_employee_by_id(
        self,
        db: Session,
        company_id: int,
        employee_id: str
    ):
        """
        Get a single employee using employee_id
        and company_id.
        """

        return (
            db.query(User)
            .filter(
                User.company_id == company_id,
                User.employee_id == employee_id,
                User.role == "EMPLOYEE"
            )
            .first()
        )

    # ============================================================
    # SEARCH EMPLOYEES
    # ============================================================

    def search_employees(
        self,
        db: Session,
        company_id: int,
        search: str
    ):
        """
        Search employees by:

        - First name
        - Last name
        - Email
        - Employee ID
        """

        search_pattern = f"%{search}%"

        return (
            db.query(User)
            .filter(
                User.company_id == company_id,
                User.role == "EMPLOYEE",
                (
                    User.first_name.ilike(search_pattern)
                    | User.last_name.ilike(search_pattern)
                    | User.email.ilike(search_pattern)
                    | User.employee_id.ilike(search_pattern)
                )
            )
            .order_by(User.first_name.asc())
            .all()
        )

    # ============================================================
    # GET EMPLOYEE BY EMAIL
    # ============================================================

    def get_employee_by_email(
        self,
        db: Session,
        company_id: int,
        email: str
    ):
        """
        Find an employee by email within a specific company.
        """

        return (
            db.query(User)
            .filter(
                User.company_id == company_id,
                User.email == email,
                User.role == "EMPLOYEE"
            )
            .first()
        )

    # ============================================================
    # UPDATE EMPLOYEE
    # ============================================================

    def update_employee(
        self,
        db: Session,
        employee: User
    ):
        """
        Save updated employee information.
        """

        db.commit()
        db.refresh(employee)

        return employee

    # ============================================================
    # DEACTIVATE EMPLOYEE
    # ============================================================

    def deactivate_employee(
        self,
        db: Session,
        employee: User
    ):
        """
        Deactivate an employee without deleting
        their record from the database.
        """

        employee.is_active = False

        db.commit()
        db.refresh(employee)

        return employee