import {notepadsApi, currentNotepad, notes} from './api/client.js';

const DELETE_ALL_NOTES_BUTTON = document.querySelector('#delete-all');
const NOTES_CONTAINER_ELEMENT = document.querySelector('#notes-container');
const NOTE_TEMPLATE = document.querySelector('#note-template');
const REFRESH_BUTTON = document.querySelector('#refresh-button');
const NAME_TAG = document.querySelector('#name-tag')

let notebookName = '';

async function deleteNote(note) {
  await notepadsApi.deleteNote(notebookName, note);
  notes.splice(notes.indexOf(note), 1);

  renderNotes();
}

function deleteAllNotes() {
  notes.forEach(note => { deleteNote(note); });
}

function sortedAndFilteredNotes(){
  let notesCopy = [...notes];
  const sortField = currentNotepad?.sorting_order || 'order'

  switch (sortField) {
    case 'alphabetical':
      return notesCopy.sort((a, b) => a.title.localeCompare(b.title))
    case 'reverse-alphabetical':
      return notesCopy.sort((a, b) => b.title.localeCompare(a.title))
    case 'order-checked':
      return notesCopy.filter((a) => a.is_checked === true)
    case 'order-unchecked':
      return notesCopy.filter((a) => a.is_checked === false)
    default:
      return notesCopy.sort((a, b) => a.order - b.order)
  }
}

function renderNotes() {
  NOTES_CONTAINER_ELEMENT.innerHTML = '';
  const notesCopies = sortedAndFilteredNotes();

  if (notesCopies.length < 1) {
    NOTES_CONTAINER_ELEMENT.innerHTML = 'There is no notes'
  }

  notesCopies.forEach(note => {
    const noteClone = NOTE_TEMPLATE.content.cloneNode(true);

    const checkbox = noteClone.querySelector('.checkbox');
    const deleteButton = noteClone.querySelector('#delete-button');
    const moveDownButton = noteClone.querySelector('#move-down-button');
    const moveUpButton = noteClone.querySelector('#move-up-button');


    noteClone.querySelector('.note-text').textContent = note.title;
    checkbox.checked = note.is_checked;

    checkbox.addEventListener('change', async () => {
      note.is_checked = checkbox.checked;
      await notepadsApi.updateNote(notebookName, note);
    });

    deleteButton.addEventListener('click', async () => {
      await deleteNote(note);
    });

    moveDownButton.addEventListener('click', async () => {
      note.order += 1;
      await notepadsApi.updateNote(notebookName, note);
      renderNotes();
    });

    moveUpButton.addEventListener('click', async () => {
      note.order -= 1;
      await notepadsApi.updateNote(notebookName, note);
      renderNotes();
    });

    NOTES_CONTAINER_ELEMENT.appendChild(noteClone);
  });
}

function loadNotes() {
  notepadsApi.getNotes(notebookName)
    .then(data => {
      renderNotes();
    })
    .catch(error => {
      console.error('Failed to load notes:', error);
    });
}

function buildNote(title, is_checked) {
  return {
    title,
    is_checked,
    slug: `${title.toLowerCase().replace(/ /g, '-')}-${Math.floor(Math.random() * 1000)}`,
    created_at: new Date().toISOString(),
    updated_at:new Date().toISOString()
  };
}

function addNote() {
  const nodeInput = document.querySelector('#note-input');
  const noteContent = nodeInput.value;
  nodeInput.value = '';

  if (noteContent) {
    notepadsApi.createNote(notebookName, buildNote(noteContent, false))
      .then(data => {
        renderNotes();
        alert('Note added successfully!');
      })
      .catch(error => {
        console.error('Failed to add note:', error);
      });
  }
}

function handleSortOrderOptions(){
  const IDS_MAPPING = {
    'alphabetical': 'A to Z',
    'reverse-alphabetical': 'Z to A',
    'order-checked': 'Checked',
    'order-unchecked': 'Non-Checked'
  }

  const MODAL_CLOSE_BUTTON = document.querySelector('#modal-close-button');
  const SORT_BUTTON_TEXT = document.querySelector('#sort-button');
  Object.keys(IDS_MAPPING).forEach((tag) => {
    document.querySelector(`#${tag}`).addEventListener('click', async () => {
      notepadsApi.update(
        notebookName,
        { ...currentNotepad, sorting_order: tag }
      );

      renderNotes();
      MODAL_CLOSE_BUTTON.click();
      SORT_BUTTON_TEXT.innerHTML = `Sort<br/>${IDS_MAPPING[tag]}`
    })
  })
}

document.addEventListener('DOMContentLoaded', function() {
  notebookName = new URLSearchParams(window.location.search).get('name');
  const submitNoteButton = document.querySelector('#note-submit');
  NAME_TAG.textContent = `Notebook: ${notebookName}`;

  notepadsApi.get(notebookName);

  submitNoteButton.addEventListener('click', async () => {
    addNote();
  });

  DELETE_ALL_NOTES_BUTTON.addEventListener('click', async () => {
    deleteAllNotes();
  });

  REFRESH_BUTTON.addEventListener('click', async () => {
    loadNotes();
  });

  handleSortOrderOptions();
  loadNotes();
});


setInterval(() => {
  if (notes.length > 0) { renderNotes(); }
}, 1000);
