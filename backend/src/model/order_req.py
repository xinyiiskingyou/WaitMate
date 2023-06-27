from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field

class Order(BaseModel):
    table_id: int = Field(alias="id", default=None)
    item: str = Field(alias="item", default=None)
    amount: int = Field(alias="amount", default=None)

Order.update_forward_refs()