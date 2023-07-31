from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field

class Item(BaseModel):
    item_id: Optional[int] = Field(alias='id', default=None)
    category: Optional[str] = Field(alias="category", default=None)
    name: str = Field(alias="name", default=None)
    cost: float = Field(alias="cost", default=None)
    description: str = Field(alias="description", default=None)
    ingredients: str = Field(alias="ingredients", default=None)
    is_vegan: Optional[bool] = Field(alias="is_vegan", default=False)
    new_index: Optional[bool] = Field(alias="new_index", default=False)

Item.update_forward_refs()