from pydantic import BaseModel
from typing import List, Optional

class NotepadSubscriber(BaseModel):
    subscriber_token: str
