from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Notepad(BaseModel):
    name: str
    slug: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

class NotepadCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = ''
    
