import os
import uuid

from fastapi import UploadFile


# ============================================================
# DIRECTORIES
# ============================================================

COMPANY_LOGO_DIR = "uploads/company_logos"
PROFILE_IMAGE_DIR = "uploads/profile_images"


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

    # Validate extension
    if extension not in COMPANY_LOGO_EXTENSIONS:
        raise ValueError(
            "Only JPG, JPEG, PNG and WEBP images are allowed"
        )

    # Read file
    content = await file.read()

    # Validate empty file
    if not content:
        raise ValueError(
            "Uploaded company logo is empty"
        )

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "Company logo must be less than 5 MB"
        )

    # Create directory
    os.makedirs(
        COMPANY_LOGO_DIR,
        exist_ok=True,
    )

    # Make company name safe for filename
    safe_company_name = "".join(
        character.lower()
        if character.isalnum()
        else "_"
        for character in company_name
    ).strip("_")

    # Fallback if company name is empty
    if not safe_company_name:
        safe_company_name = "company"

    # Generate unique ID
    unique_id = uuid.uuid4().hex[:12]

    # Create filename
    filename = (
        f"{safe_company_name}_logo_"
        f"{unique_id}"
        f"{extension}"
    )

    # Complete path
    file_path = os.path.join(
        COMPANY_LOGO_DIR,
        filename,
    )

    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Return URL/path
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

    # Validate extension
    if extension not in PROFILE_IMAGE_EXTENSIONS:
        raise ValueError(
            "Only JPG, JPEG, PNG and WEBP images are allowed"
        )

    # Read file
    content = await image.read()

    # Validate empty file
    if not content:
        raise ValueError(
            "Uploaded profile image is empty"
        )

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise ValueError(
            "Profile image must be less than 5 MB"
        )

    # Create directory
    os.makedirs(
        PROFILE_IMAGE_DIR,
        exist_ok=True,
    )

    # Generate unique filename
    filename = (
        f"user_{user_id}_"
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    # Complete path
    file_path = os.path.join(
        PROFILE_IMAGE_DIR,
        filename,
    )

    # Save file
    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Return URL/path
    return file_path.replace("\\", "/")