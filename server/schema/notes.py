from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Note(BaseModel):
    title: str
    slug: str
    order: int
    notepad_name: str
    is_checked: bool
    kind: int
    created_at: datetime
    updated_at: datetime

class NoteCreate(BaseModel):
    title: str
    slug: str
    order: Optional[int] = 0
    kind: Optional[int] = 0
    is_checked: Optional[bool] = False
