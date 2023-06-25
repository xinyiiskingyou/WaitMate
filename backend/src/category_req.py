from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field


class Category(BaseModel):
    name: Optional[str] = Field(alias="name", default=None)

Category.update_forward_refs()