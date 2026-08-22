import os
import uuid

from fastapi import UploadFile


UPLOAD_DIR = "uploads/company_logos"

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
}

MAX_FILE_SIZE = 5 * 1024 * 1024


async def save_company_logo(
    file: UploadFile,
    company_name: str
) -> str:

    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Only JPG, JPEG, PNG and WEBP images are allowed"
        )

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "Company logo must be less than 5 MB"
        )

    os.makedirs(
        UPLOAD_DIR,
        exist_ok=True
    )

    safe_company_name = "".join(
        character.lower()
        if character.isalnum()
        else "_"
        for character in company_name
    ).strip("_")

    unique_id = uuid.uuid4().hex[:12]

    filename = (
        f"{safe_company_name}_logo_{unique_id}"
        f"{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    return file_path.replace("\\", "/")