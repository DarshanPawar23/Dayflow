from sqlalchemy.orm import Session

from repositories.employee_management_repository import (
    EmployeeManagementRepository
)


class EmployeeManagementService:
    """
    Service layer for HR employee management operations.

    Handles:
    - HR authorization
    - Employee retrieval
    - Employee search
    - Employee updates
    - Employee deactivation
    """

    def __init__(self):
        self.repository = EmployeeManagementRepository()

    # ============================================================
    # AUTHORIZATION
    # ============================================================

    def _check_hr(self, current_user):
        """
        Ensure that only HR users can manage employees.
        """

        if current_user["role"] != "HR":
            raise Exception(
                "Only HR can manage employees"
            )

    # ============================================================
    # GET ALL EMPLOYEES
    # ============================================================

    def get_all_employees(
        self,
        db: Session,
        current_user
    ):
        """
        Get all employees belonging to the HR user's company.
        """

        self._check_hr(current_user)

        company_id = current_user["company_id"]

        return self.repository.get_all_employees(
            db,
            company_id
        )

    # ============================================================
    # GET SINGLE EMPLOYEE
    # ============================================================

    def get_employee(
        self,
        db: Session,
        employee_id: str,
        current_user
    ):
        """
        Get a specific employee by employee ID.
        """

        self._check_hr(current_user)

        company_id = current_user["company_id"]

        employee = self.repository.get_employee_by_id(
            db,
            company_id,
            employee_id
        )

        if not employee:
            raise Exception(
                "Employee not found"
            )

        return employee

    # ============================================================
    # SEARCH EMPLOYEES
    # ============================================================

    def search_employees(
        self,
        db: Session,
        search: str,
        current_user
    ):
        """
        Search employees within the HR user's company.
        """

        self._check_hr(current_user)

        company_id = current_user["company_id"]

        return self.repository.search_employees(
            db,
            company_id,
            search
        )

    # ============================================================
    # UPDATE EMPLOYEE
    # ============================================================

    def update_employee(
        self,
        db: Session,
        employee_id: str,
        request,
        current_user
    ):
        """
        Update employee information.

        Only fields provided in the request are updated.
        Also prevents duplicate email addresses within
        the same company.
        """

        self._check_hr(current_user)

        company_id = current_user["company_id"]

        # --------------------------------------------------------
        # Find employee
        # --------------------------------------------------------

        employee = self.repository.get_employee_by_id(
            db,
            company_id,
            employee_id
        )

        if not employee:
            raise Exception(
                "Employee not found"
            )

        # --------------------------------------------------------
        # Check email uniqueness
        # --------------------------------------------------------

        if request.email is not None:

            existing_employees = (
                self.repository.search_employees(
                    db,
                    company_id,
                    request.email
                )
            )

            for existing in existing_employees:

                if (
                    existing.email == request.email
                    and existing.id != employee.id
                ):
                    raise Exception(
                        "Email already registered"
                    )

        # --------------------------------------------------------
        # Update employee fields
        # --------------------------------------------------------

        if request.first_name is not None:
            employee.first_name = request.first_name

        if request.last_name is not None:
            employee.last_name = request.last_name

        if request.email is not None:
            employee.email = request.email

        if request.phone is not None:
            employee.phone = request.phone

        if request.joining_year is not None:
            employee.joining_year = request.joining_year

        # --------------------------------------------------------
        # Save updated employee
        # --------------------------------------------------------

        return self.repository.update_employee(
            db,
            employee
        )

    # ============================================================
    # DEACTIVATE EMPLOYEE
    # ============================================================

    def deactivate_employee(
        self,
        db: Session,
        employee_id: str,
        current_user
    ):
        """
        Deactivate an employee.

        The employee is not deleted from the database.
        Instead, their active status is changed to inactive.
        """

        self._check_hr(current_user)

        company_id = current_user["company_id"]

        # --------------------------------------------------------
        # Find employee
        # --------------------------------------------------------

        employee = self.repository.get_employee_by_id(
            db,
            company_id,
            employee_id
        )

        if not employee:
            raise Exception(
                "Employee not found"
            )

        # --------------------------------------------------------
        # Check current status
        # --------------------------------------------------------

        if not employee.is_active:
            raise Exception(
                "Employee is already inactive"
            )

        # --------------------------------------------------------
        # Deactivate employee
        # --------------------------------------------------------

        employee = self.repository.deactivate_employee(
            db,
            employee
        )

        # --------------------------------------------------------
        # Return response
        # --------------------------------------------------------

        return {
            "message": "Employee deactivated successfully",
            "employee_id": employee.employee_id,
            "is_active": employee.is_active
        }