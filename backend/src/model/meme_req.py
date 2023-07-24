from __future__ import annotations

from typing import Optional  # noqa: F401
from pydantic import BaseModel, Field

class Memes(BaseModel):
    url: str = Field(alias="url", default=None)
    filename: Optional[str] = Field(alias='filename', default=None)
    count: int = Field(alias="count", default=0)

Memes.update_forward_refs()