from __future__ import annotations

from typing import Optional  # noqa: F401
from pydantic import BaseModel, Field

class Coupon(BaseModel):
    code: str = Field(alias="code", default=None)
    int: int = Field(alias="int", default=None)
    expiry: str = Field(alias="expiry", default=None)

Coupon.update_forward_refs()

class Coupon_Cust(BaseModel):
    id: int = Field(alias="id", default=None)
    code: str = Field(alias="code", default=None)

Coupon_Cust.update_forward_refs()