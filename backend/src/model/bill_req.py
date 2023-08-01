from __future__ import annotations

from pydantic import BaseModel, Field

class Tip(BaseModel):
    id: int = Field(alias="id", default=None)
    amount: int = Field(alias="amount", default=None)

Tip.update_forward_refs()