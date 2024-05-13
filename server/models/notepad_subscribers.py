from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref
from .database import Base

class NotepadSubscribers(Base):
    __tablename__ = "notepad_subscribers"
    subscriber_token = Column(String, index=True, primary_key=True)
