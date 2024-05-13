import uvicorn
from fastapi import FastAPI, Depends, HTTPException
import models
import schema
from models.database import SessionLocal, engine
from sqlalchemy.orm import Session
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/notepads/", response_model=schema.Notepad)
def create_notepad(notepad: schema.NotepadCreate, db: Session = Depends(get_db)):
    db_notepad = models.Notepads(name=notepad.name)
    db.add(db_notepad)
    db.commit()
    db.refresh(db_notepad)

    return db_notepad

@app.get("/notepads/", response_model=List[schema.Notepad])
def read_notepads(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    notepads = db.query(models.Notepads).offset(skip).limit(limit).all()
    return notepads

@app.get("/notepads/{notepad_id}", response_model=schema.Notepad)
def read_notepad(notepad_id: int, db: Session = Depends(get_db)):
    db_notepad = db.query(models.Notepads).filter(models.Notepads.id == notepad_id).first()
    if db_notepad is None:
        raise HTTPException(status_code=404, detail="Notepad not found")
    return db_notepad

@app.put("/notepads/{notepad_id}", response_model=schema.Notepad)
def update_notepad(notepad_id: int, notepad: schema.NotepadCreate, db: Session = Depends(get_db)):
    db_notepad = db.query(models.Notepads).filter(models.Notepads.id == notepad_id).first()
    if db_notepad is None:
        raise HTTPException(status_code=404, detail="Notepad not found")
    db_notepad.name = notepad.name
    db.commit()
    db.refresh(db_notepad)
    return db_notepad

@app.delete("/notepads/{notepad_id}")
def delete_notepad(notepad_id: int, db: Session = Depends(get_db)):
    db_notepad = db.query(models.Notepads).filter(models.Notepads.id == notepad_id).first()
    if db_notepad is None:
        raise HTTPException(status_code=404, detail="Notepad not found")
    db.delete(db_notepad)
    db.commit()
    return {"message": "Notepad deleted successfully"}

@app.post("/notepads/{notepad_id}/notes/", response_model=schema.Note)
def create_note_for_notepad(notepad_id: int, note: schema.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Notes(**note.dict(), notepad_id=notepad_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notepads/{notepad_id}/notes/", response_model=List[schema.Note])
def read_notes_for_notepad(notepad_id: int, db: Session = Depends(get_db)):
    notes = db.query(models.Notes).filter(models.Notes.notepad_id == notepad_id).all()
    return notes

@app.get("/notepads/{notepad_id}/notes/{note_id}", response_model=schema.Note)
def read_note_for_notepad(notepad_id: int, note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Notes).filter(models.Notes.notepad_id == notepad_id, models.Notes.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return db_note

@app.put("/notepads/{notepad_id}/notes/{note_id}", response_model=schema.Note)
def update_note_for_notepad(notepad_id: int, note_id: int, note: schema.NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(models.Notes).filter(models.Notes.notepad_id == notepad_id, models.Notes.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db_note.title = note.title
    db_note.description = note.description
    db_note.kind = note.kind
    db.commit()
    db.refresh(db_note)
    return db_note

@app.delete("/notepads/{notepad_id}/notes/{note_id}")
def delete_note_for_notepad(notepad_id: int, note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Notes).filter(models.Notes.notepad_id == notepad_id, models.Notes.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
