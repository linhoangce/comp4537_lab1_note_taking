export default class StorageManager {
	constructor(storageKey) {
		this.storageKey = storageKey;
		this.isDirty = false;
	}

	saveNotes(notes) {
		const notesData = notes.map(function (notes) {
			return notes.getData();
		});

		try {
			const jsonData = JSON.stringify(notesData);
			localStorage.setItem(this.storageKey, jsonData);
			this.isDirty = false;
			return true;
		} catch (e) {
			console.error("Error saving to localStorage: ", e);
			return false;
		}
	}

	loadNotes() {
		try {
			const jsonData = localStorage.getItem(this.storageKey);
			if (jsonData) {
				return JSON.parse(jsonData);
			}
			return [];
		} catch (e) {
			console.error("Error loading from localStorage: ", e);
			return [];
		}
	}

	removeNote(noteId) {
		const notesData = this.loadNotes();
		const filteredNotes = notesData.filter((note) => {
			return note.id !== noteId;
		});

		try {
			const jsonData = JSON.stringify(filteredNotes);
			localStorage.setItem(this.storageKey, jsonData);
			return true;
		} catch (e) {
			console.error("Error removing note from localStorage: ", e);
			return false;
		}
	}

	markDirty() {
		this.isDirty = true;
	}

	isDirtyState() {
		return this.isDirty;
	}
}
