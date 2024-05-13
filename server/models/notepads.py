import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, backref
from .database import Base

class Notepads(Base):
    __tablename__ = "notepads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    description = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

    notes = relationship("Notes", backref=backref("notepads", uselist=False))
