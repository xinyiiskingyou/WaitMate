from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field
from src.model.category_req import Category_Name

class Item(BaseModel):
    item_id: Optional[int] = Field(alias='id', default=None)
    category: Optional[str] = Field(alias="category", default=None)
    name: Optional[str] = Field(alias="name", default=None)
    cost: Optional[float] = Field(alias="cost", default=None)
    description: Optional[str] = Field(alias="description", default=None)
    ingredients: Optional[str] = Field(alias="ingredients", default=None)
    is_vegan: Optional[bool] = Field(alias="is_vegan", default=False)

Item.update_forward_refs()