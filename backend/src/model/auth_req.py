from __future__ import annotations

from pydantic import BaseModel, Field

class LoginMan(BaseModel):
    email: str = Field(alias='email', default=None)
    password: str = Field(alias='password', default=None)

LoginMan.update_forward_refs()

class Password(BaseModel):
    password: str = Field(alias='password', default=None)

Password.update_forward_refs()

class Email(BaseModel):
    email: str = Field(alias='email', default=None)

Email.update_forward_refs()