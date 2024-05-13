import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, backref
from .database import Base

class Notepads(Base):
    __tablename__ = "notepads"

    name = Column(String, index=True, unique=True, primary_key=True)
    description = Column(String, nullable=True)
    sorting_order = Column(String, default='created_at')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    notes = relationship("Notes", backref=backref("notepads", uselist=False))
