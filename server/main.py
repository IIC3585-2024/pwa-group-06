import datetime
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models
import schema
from models.database import SessionLocal, engine
from sqlalchemy.orm import Session
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/notepads/", response_model=schema.Notepad)
def create_or_find_notepad(notepad: schema.NotepadCreate, db: Session = Depends(get_db)):
    db_notepad = db.query(models.Notepads).filter(models.Notepads.name == notepad.name).first()
    if db_notepad is None:
        db_notepad = models.Notepads(name=notepad.name)
        db.add(db_notepad)
        db.commit()
        db.refresh(db_notepad)
    return db_notepad

@app.get("/notepads/", response_model=List[schema.Notepad])
def read_notepads(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    notepads = db.query(models.Notepads).offset(skip).limit(limit).all()
    return notepads

@app.get("/notepads/{notepad_name}", response_model=schema.Notepad)
def read_notepad(notepad_name: str, db: Session = Depends(get_db)):
    db_notepad = db.query(models.Notepads).filter(models.Notepads.name == notepad_name).first()
    if db_notepad is None:
        raise HTTPException(status_code=404, detail="Notepad not found")
    return db_notepad

@app.put("/notepads/{notepad_name}", response_model=schema.Notepad)
def update_notepad(notepad_name: str, notepad: schema.NotepadCreate, db: Session = Depends(get_db)):
    db_notepad = db.query(models.Notepads).filter(models.Notepads.name == notepad_name).first()
    if db_notepad is None:
        raise HTTPException(status_code=404, detail="Notepad not found")
    db_notepad.name = notepad.name
    db.commit()
    db.refresh(db_notepad)
    return db_notepad

@app.delete("/notepads/{notepad_name}")
def delete_notepad(notepad_name: str, db: Session = Depends(get_db)):
    db_notepad = db.query(models.Notepads).filter(models.Notepads.name == notepad_name).first()
    if db_notepad is None:
        raise HTTPException(status_code=404, detail="Notepad not found")
    db.delete(db_notepad)
    db.commit()
    return {"message": "Notepad deleted successfully"}

@app.post("/notepads/{notepad_name}/notes/", response_model=schema.Note)
def create_note_for_notepad(notepad_name: str, note: schema.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Notes(**note.dict(), notepad_name=notepad_name)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notepads/{notepad_name}/notes/", response_model=List[schema.Note])
def read_notes_for_notepad(notepad_name: str, db: Session = Depends(get_db)):
    notes = db.query(models.Notes).filter(models.Notes.notepad_name == notepad_name).all()
    return notes

@app.get("/notepads/{notepad_name}/notes/{note_slug}", response_model=schema.Note)
def read_note_for_notepad(notepad_name: str, note_slug: str, db: Session = Depends(get_db)):
    db_note = db.query(models.Notes).filter(models.Notes.notepad_name == notepad_name, models.Notes.slug == note_slug).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.put("/notepads/{notepad_name}/notes/{note_slug}", response_model=schema.Note)
def update_note_for_notepad(notepad_name: str, note_slug: str, note: schema.NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(models.Notes).filter(models.Notes.notepad_name == notepad_name, models.Notes.slug == note_slug).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")

    db_note.title = note.title
    db_note.order = note.order
    db_note.is_checked = note.is_checked
    db_note.kind = note.kind
    db_note.updated_at = datetime.datetime.utcnow()

    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notepads/{notepad_name}/notes/{note_slug}")
def delete_note_for_notepad(notepad_name: str, note_slug: str, db: Session = Depends(get_db)):
    db_note = db.query(models.Notes).filter(models.Notes.notepad_name == notepad_name, models.Notes.slug == note_slug).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
