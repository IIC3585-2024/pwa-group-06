from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Note(BaseModel):
    id: Optional[int]
    notepad_id: int
    title: str
    order: int
    checked: bool
    kind: int
    created_at: datetime
    updated_at: datetime

class NoteCreate(BaseModel):
    title: str
    order: Optional[int] = 0
    kind: Optional[int] = 0
    checked: Optional[bool] = False
