from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field

class Order(BaseModel):
    table_id: int = Field(alias="id", default=None)
    amount: Optional[int] = Field(alias="amount", default=None)
    item_name: Optional[str] = Field(alias="name", default=None)

Order.update_forward_refs()