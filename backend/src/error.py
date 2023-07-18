'''
This module defines custom exception classes for handling specific HTTP errors
in a FastAPI application.
'''
from fastapi import HTTPException
from constant import DEFAULT_MSG
class AccessError(HTTPException):
    '''
    Inherits from HTTPException with a default status code of 403.

    Args:
        detail (str): Additional details or error message (default: 'No message specified').
    '''
    def __init__(self, detail: str = DEFAULT_MSG):
        super().__init__(status_code=403, detail=detail)

class InputError(HTTPException):
    '''
    Inherits from HTTPException with a default status code of 400.

    Args:
        detail (str): Additional details or error message (default: 'No message specified').
    '''
    def __init__(self, detail: str = DEFAULT_MSG):
        super().__init__(status_code=400, detail=detail)

class NotFoundError(HTTPException):
    '''
    Inherits from HTTPException with a default status code of 404.

    Args:
        detail (str): Additional details or error message (default: 'No message specified').
    '''
    def __init__(self, detail: str = DEFAULT_MSG):
        super().__init__(status_code=404, detail=detail)
