from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Notepad(BaseModel):
    name: str
    sorting_order: Optional[str]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

class NotepadCreate(BaseModel):
    name: str
    sorting_order: Optional[str] = 'order'
    description: Optional[str] = ''
    
