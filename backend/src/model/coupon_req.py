from __future__ import annotations

from pydantic import BaseModel, Field

class Coupon(BaseModel):
    code: str = Field(alias="code", default=None)
    amount: int = Field(alias="amount", default=None)
    expiry: str = Field(alias="expiry", default=None)

Coupon.update_forward_refs()

class Coupon_Code(BaseModel):
    code: str = Field(alias="code", default=None)

Coupon_Code.update_forward_refs()

class Coupon_Cust(BaseModel):
    id: int = Field(alias="id", default=None)
    code: str = Field(alias="code", default=None)

Coupon_Cust.update_forward_refs()