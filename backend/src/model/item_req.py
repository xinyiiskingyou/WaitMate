from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field


class Item(BaseModel):
    category: str = Field(alias="name", default=None)
    cost: float = Field(alias="cost", default=None)
    description: str = Field(alias="cost", default=None)
    ingredients: str = Field(alias="cost", default=None)
    is_vegan: bool = Field(alias="is_vegan", default=False)
    name: str = Field(alias="name", default=None)

Item.update_forward_refs()