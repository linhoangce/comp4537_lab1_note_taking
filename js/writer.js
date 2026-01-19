import StorageManager from "../js/StorageManager.js";
import Note from "../js/Note.js";
import { UserMessages } from "../lang/messages/en/user.js";

export class WriterApp {
	constructor() {
		this.notes = [];
		this.nextId = 1;
		this.storageManager = new StorageManager("notes");
		this.saveInterval = null;
		this.notesContainer = null;
		this.addNotBtn = null;
		this.lastSavedElement = null;
	}

	init() {
		this.notesContainer = document.getElementById("notesContainer");
		this.addNoteBtn = document.getElementById("addNoteBtn");
		this.lastSavedElement = document.getElementById("lastSaved");

		// load existing notes from storage
		this.loadNotesFromStorage();
		this.updateLastSaved();

		this.addNoteBtn.addEventListener("click", () => {
			this.addNote();
		});

		this.saveInterval = setInterval(() => {
			this.autoSave();
			this.updateLastSaved();
		}, 2000);

		window.addEventListener("storage", (e) => {
			if (e.key === "notes") {
				self.loadNotesFromStorage();
			}
		});
	}

	loadNotesFromStorage() {
		const notesData = this.storageManager.loadNotes();

		// clear existing notes
		this.notes = [];
		this.notesContainer.innerHTML = "";

		if (notesData === 0) {
			this.addNote();
		} else {
			for (let i = 0; i < notesData.length; i++) {
				const noteData = notesData[i];
				const note = new Note(noteData.id, noteData.content, this.storageManager);
				this.notes.push(note);
				const noteElement = note.createElements();
				this.notesContainer.appendChild(noteElement);

				// update nextId to avoid conflicts
				if (noteData.id >= this.nextId) {
					this.nextId = noteData.id + 1;
				}
			}
		}
	}

	addNote() {
		const note = new Note(this.nextId++, "", this.storageManager);
		this.notes.push(note);
		const noteElement = note.createElements();

		// insert child before add button
		this.notesContainer.appendChild(noteElement);

		// focus on new textarea
		note.textArea.focus();

		this.storageManager.markDirty();
		this.saveNotes();
	}

	autoSave() {
		// save only if any changes
		if (this.storageManager.isDirtyState()) {
			this.saveNotes();
		}
	}

	saveNotes() {
		const self = this;
		this.notes = this.notes.filter((note) => {
			return note.container && note.container.parentNode;
		});

		// save to storage
		if (this.storageManager.saveNotes(this.notes)) {
			this.updateLastSaved();
		}
	}

	updateLastSaved() {
		const now = new Date();
		const timeString = now.toLocaleTimeString();
		this.lastSavedElement.textContent = UserMessages.writer.lastSaved + timeString;
	}
}

export const app = new WriterApp();
app.init();
