from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class Table(BaseModel):
    table_id: int = Field(alias="table_id", default=None)
    status: Optional[str] = Field(alias="status", default=None)


Table.update_forward_refs()
