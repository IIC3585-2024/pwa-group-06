from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref
from .database import Base

class NotepadSubscribers(Base):
    __tablename__ = "notepad_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    subscriber_token = Column(String, index=True)
    notepad_name = Column(Integer, ForeignKey("notepads.name"))

    notepads = relationship("Notepads", backref=backref("notepad_subscribers", uselist=False))
