from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field

class CategoryUpdate(BaseModel):
    cat_id: Optional[int] = Field(alias="id", default=None)
    name: Optional[str] = Field(alias="name", default=None)
    cat_order: Optional[int] = Field(alias="order", default=None)
    new_name: Optional[str] = Field(alias="new_name", default=None)
CategoryUpdate.update_forward_refs()