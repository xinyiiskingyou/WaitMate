from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field

class Category(BaseModel):
    cat_id: Optional[int] = Field(alias="id", default=None)
    name: Optional[str] = Field(alias="name", default=None)
    cat_order: Optional[int] = Field(alias="order", default=None)

class Category_ID(BaseModel):
    cat_id: int = Field(alias="id", default=None)

class Category_Name(BaseModel):
    name: str = Field(alias="name", default=None)

Category.update_forward_refs()