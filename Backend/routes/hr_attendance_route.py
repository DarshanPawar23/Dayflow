from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    Query
)

from sqlalchemy.orm import Session

from storage.mysql.connection import get_db

from controllers.hr_attendance_controller import (
    HRAttendanceController
)

from dependencies.auth_dependency import (
    get_current_user
)


router = APIRouter(
    prefix="/hr/attendance",
    tags=["HR Attendance"]
)


controller = HRAttendanceController()


@router.get("")
def get_attendance(
    start_date: date = Query(...),
    end_date: date = Query(...),
    employee_id: str | None = Query(
        default=None
    ),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return controller.get_attendance_report(
        db,
        current_user,
        start_date,
        end_date,
        employee_id
    )