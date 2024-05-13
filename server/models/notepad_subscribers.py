from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, backref
from .database import Base

class NotepadSubscribers(Base):
    __tablename__ = "notepad_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    notepad_id = Column(String, index=True)
    notepad_id = Column(Integer, ForeignKey("notepads.id"))

    notepads = relationship("Notepads", backref=backref("notepad_subscribers", uselist=False))
