from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field

class Votes(BaseModel):
    email: str = Field(alias="email", default=None)
    filename: Optional[str] = Field(alias="filename", default=None)

Votes.update_forward_refs()