from __future__ import annotations

from typing import Any, Dict, List, Optional  # noqa: F401
from pydantic import BaseModel, Field

class Table(BaseModel):
    table_id: Optional[int] = Field(alias="table_id", default=None)
    status: Optional[str] = Field(alias="status", default=None)

class Table_Cust(BaseModel):
    table_id: int = Field(alias="table_id", default=None)

Table.update_forward_refs()
Table_Cust.update_forward_refs()
