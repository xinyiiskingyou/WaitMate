from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field

class Table(BaseModel):
    table_id: Optional[int] = Field(alias="id", default=None)
    status: Optional[str] = Field(alias="status", default=None)

Table.update_forward_refs()