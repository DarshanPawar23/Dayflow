from sqlalchemy.orm import Session

from storage.mysql.models.user_model import User


def generate_employee_id(
    db: Session,
    first_name: str,
    last_name: str,
    joining_year: int
):
    prefix = (
        first_name[:1] +
        last_name[:1]
    ).upper()

    year = str(joining_year)

    last_employee = (
        db.query(User)
        .filter(
            User.employee_id.like(
                f"{prefix}{year}-%"
            )
        )
        .order_by(User.id.desc())
        .first()
    )

    if last_employee:
        last_number = int(
            last_employee.employee_id.split("-")[-1]
        )
        number = last_number + 1
    else:
        number = 1

    return f"{prefix}{year}-{number:03d}"