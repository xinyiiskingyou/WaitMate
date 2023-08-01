from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field

class CategoryOrder(BaseModel):
    cat_id: Optional[int] = Field(alias="id", default=None)
    name: Optional[str] = Field(alias="name", default=None)
    cat_order: Optional[int] = Field(alias="order", default=None)
    new_index: Optional[int] = Field(alias="new_index", default=-1)

CategoryOrder.update_forward_refs()