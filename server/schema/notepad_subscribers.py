from pydantic import BaseModel
from typing import List, Optional

class NotepadSubscriber(BaseModel):
    id: Optional[int]
    notepad_id: int
    device_id: str
