from __future__ import annotations

from pydantic import BaseModel, Field

class Password(BaseModel):
    password: str = Field(alias='password', default=None)

Password.update_forward_refs()

class Email(BaseModel):
    email: str = Field(alias='email', default=None)

Email.update_forward_refs()

class StaffType(BaseModel):
    stafftype: list = Field(alias='stafftype', default=None)

StaffType.update_forward_refs()