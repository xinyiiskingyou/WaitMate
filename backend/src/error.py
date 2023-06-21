from fastapi import HTTPException

class AccessError(HTTPException):
    def __init__(self, detail: str = 'No message specified'):
        super().__init__(status_code=403, detail=detail)

class InputError(HTTPException):
    def __init__(self, detail: str = 'No message specified'):
        super().__init__(status_code=400, detail=detail)

class NotFoundError(HTTPException):
    def __init__(self, detail: str = 'No message specified'):
        super().__init__(status_code=404, detail=detail)