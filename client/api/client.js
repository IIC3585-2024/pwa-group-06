import idbApi from './local-database.js';

const BASE_URL = 'http://localhost:8080';
let currentNotepad = null;
let notes = [];

const notepadsApi = {
  async subscribeNotifications(token) {
    try {
      const response = await fetch(`${BASE_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriber_token: token }),
      });
      return response.ok;
    } catch (error) {
      console.log(error);
    }
  },
  async create(notepad) {
    try {
      const response = await fetch(`${BASE_URL}/notepads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notepad),
      });
      
      const notepadJson = await response.json();
      await idbApi.set('notepads', { id: notepadJson.name, ...notepadJson }, true)

      return notepadJson;
    } catch (error) {
      await idbApi.set('notepads', { id: notepad.name, ...notepad }, false);
      navigator.serviceWorker.ready.then(swRegistration => {
        return swRegistration.sync.register('sync-notepads');
      });

      currentNotepad = notepad;
    }
  },
  get: async (notepadName) => {
    try {
      const response = await fetch(`${BASE_URL}/notepads/${notepadName}`);
      const notepad = await response.json();
      await idbApi.set('notepads', { id: notepad.name, ...notepad }, true)
      currentNotepad = notepad;
    } catch (error) {
      const res = await idbApi.get('notepads', notepadName);
      res.onsuccess = function() {
        currentNotepad = res.result;
      }
    }
  },
  update: async (notepadName, notepad) => {
    try {
      const response = await fetch(`${BASE_URL}/notepads/${notepadName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notepad),
      });

      const notepadJson = await response.json();
      await idbApi.set('notepads', { id: notepadJson.name, ...notepadJson }, true)
      currentNotepad = notepadJson;
    } catch (error) {
      console.log(error);
      await idbApi.set('notepads', { id: notepad.name, ...notepad }, false);
      currentNotepad = notepad;
    }
  },
  createNote: async (notepadName, note) => {
    let resultNote = note;
    try {
      const response = await fetch(`${BASE_URL}/notepads/${notepadName}/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });

      const resultNote = await response.json();
      await idbApi.set('notes', { id: `${notepadName}-${resultNote.slug}`, note: resultNote }, false);
    } catch (error) {
      await idbApi.set('notes', { id: `${notepadName}-${resultNote.slug}`, note: resultNote }, true);
    } finally {
      notes.push(resultNote);
    }
  },
  updateNote: async (notepadName, note) => {
    let jsonNote = note;
    try {
      const response = await fetch(`${BASE_URL}/notepads/${notepadName}/notes/${note.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      const jsonNote = await response.json();
      await idbApi.set('notes', { id: `${notepadName}-${jsonNote.slug}`, note: jsonNote }, false);
      return jsonResponse;
    } catch (error) {
      await idbApi.set('notes', { id: `${notepadName}-${jsonNote.slug}`, note: jsonNote }, true);
    }
  },
  deleteNote: async (notepadName, note) => {
    try {
      const response = await fetch(`${BASE_URL}/notepads/${notepadName}/notes/${note.slug}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await idbApi.delete('notes', `${notepadName}-${note.slug}`, false); // Attempt to remove from local database on success using notepad name and note id as key
      }
      return response.ok;
    } catch (error) {
      await idbApi.delete('notes', `${notepadName}-${note.slug}`, true); // Attempt to remove from local database on failure using notepad name and note id as key
      navigator.serviceWorker.ready.then(swRegistration => {
        return swRegistration.sync.register('sync-notes');
      });
    }
  },
  getNotes: async (notepadName) => {
    try {
      const response = await fetch(`${BASE_URL}/notepads/${notepadName}/notes/`)
      const jsonResponse = await response.json();
      jsonResponse.forEach(note => {
        note.notepad_name = notepadName;

        idbApi.set('notes', { id: `${notepadName}-${note.slug}`, note }, true);
      });

      notes = jsonResponse;
    } catch (error) {
      const res = await idbApi.getAll('notes');
      res.onsuccess = function() {
        const allNotes = res.result;
        notes = allNotes.filter(element => element.id.startsWith(notepadName)).map(element => element.note);
      }
    }
  },
};

export { notepadsApi, currentNotepad, notes}
