from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field

class Order(BaseModel):
    table_id: int = Field(alias="id", default=None)
    item: str = Field(alias="item", default=None)
    amount: int = Field(alias="amount", default=None)
    is_prepared: Optional[int] = Field(alias="is_prepared", default=0)
    is_served: Optional[int] = Field(alias="is_served", default=0)

Order.update_forward_refs()