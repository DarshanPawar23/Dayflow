import os
import uuid

from fastapi import UploadFile


# ============================================================
# DIRECTORIES
# ============================================================

COMPANY_LOGO_DIR = "uploads/company_logos"
PROFILE_IMAGE_DIR = "uploads/profile_images"
MEDICAL_CERTIFICATE_DIR = "uploads/medical_certificates"


# ============================================================
# ALLOWED FILE TYPES
# ============================================================

COMPANY_LOGO_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

PROFILE_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

MEDICAL_CERTIFICATE_EXTENSIONS = {
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
}


# ============================================================
# FILE SIZE
# ============================================================

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


# ============================================================
# COMPANY LOGO
# ============================================================

async def save_company_logo(
    file: UploadFile,
    company_name: str,
) -> str:

    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if extension not in COMPANY_LOGO_EXTENSIONS:
        raise ValueError(
            "Only JPG, JPEG, PNG and WEBP images are allowed"
        )

    content = await file.read()

    if not content:
        raise ValueError(
            "Uploaded company logo is empty"
        )

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "Company logo must be less than 5 MB"
        )

    os.makedirs(
        COMPANY_LOGO_DIR,
        exist_ok=True,
    )

    safe_company_name = "".join(
        character.lower()
        if character.isalnum()
        else "_"
        for character in company_name
    ).strip("_")

    if not safe_company_name:
        safe_company_name = "company"

    unique_id = uuid.uuid4().hex[:12]

    filename = (
        f"{safe_company_name}_logo_"
        f"{unique_id}"
        f"{extension}"
    )

    file_path = os.path.join(
        COMPANY_LOGO_DIR,
        filename,
    )

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    return file_path.replace("\\", "/")


# ============================================================
# USER PROFILE IMAGE
# ============================================================

async def save_profile_image(
    image: UploadFile,
    user_id: int,
) -> str:

    extension = os.path.splitext(
        image.filename or ""
    )[1].lower()

    if extension not in PROFILE_IMAGE_EXTENSIONS:
        raise ValueError(
            "Only JPG, JPEG, PNG and WEBP images are allowed"
        )

    content = await image.read()

    if not content:
        raise ValueError(
            "Uploaded profile image is empty"
        )

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "Profile image must be less than 5 MB"
        )

    os.makedirs(
        PROFILE_IMAGE_DIR,
        exist_ok=True,
    )

    filename = (
        f"user_{user_id}_"
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    file_path = os.path.join(
        PROFILE_IMAGE_DIR,
        filename,
    )

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    return file_path.replace("\\", "/")


# ============================================================
# MEDICAL CERTIFICATE
# ============================================================

async def save_medical_certificate(
    file: UploadFile,
    user_id: int,
) -> str:

    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if extension not in MEDICAL_CERTIFICATE_EXTENSIONS:
        raise ValueError(
            "Only PDF, JPG, JPEG and PNG files are allowed"
        )

    content = await file.read()

    if not content:
        raise ValueError(
            "Uploaded medical certificate is empty"
        )

    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "Medical certificate must be less than 5 MB"
        )

    os.makedirs(
        MEDICAL_CERTIFICATE_DIR,
        exist_ok=True,
    )

    unique_id = uuid.uuid4().hex[:12]

    filename = (
        f"user_{user_id}_certificate_"
        f"{unique_id}"
        f"{extension}"
    )

    file_path = os.path.join(
        MEDICAL_CERTIFICATE_DIR,
        filename,
    )

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    return file_path.replace("\\", "/")