import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, backref
from .database import Base

class Notes(Base):
    __tablename__ = "notes"

    title = Column(String, index=True)
    slug = Column(String, index=True, unique=True, primary_key=True)
    order = Column(Integer, index=True)
    is_checked = Column(Boolean, index=True)
    kind = Column(Integer, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    notepad_name = Column(String, ForeignKey("notepads.name"), index=True)
