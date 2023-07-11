from __future__ import annotations

from typing import Optional  # noqa: F401
from pydantic import BaseModel, Field

class Tip(BaseModel):
    id: int = Field(alias="id", default=None)
    amount: int = Field(alias="amount", default=None)

Tip.update_forward_refs()