import StorageManager from "../js/StorageManager.js";
import { UserMessages } from "../lang/messages/en/user.js";

export class ReaderApp {
	constructor() {
		this.storageManager = new StorageManager("notes");
		this.retrieveInterval = null;
		this.notesDisplay = null;
		this.lastRetrievedElement = null;
	}

	init() {
		this.notesDisplay = document.getElementById("notesDisplay");
		this.lastRetrievedElement = document.getElementById("lastRetrieved");

		// load notes
		this.loadNotes();

		this.retrieveInterval = setInterval(() => {
			this.loadNotes();
		}, 2000);

		window.addEventListener("storage", (e) => {
			if (e.key === "notes") {
				this.loadNotes();
			}
		});
	}

	loadNotes() {
		const notesData = this.storageManager.loadNotes();
		this.displayNotes(notesData);
		this.updateLastRetrieved();
	}

	displayNotes(notesData) {
		this.notesDisplay.innerHTML = "";

		if (notesData.length === 0) {
			const noNotesDiv = document.createElement("div");
			noNotesDiv.className = "no-notes";
			noNotesDiv.textContent = UserMessages.reader.noNotes;
			this.notesDisplay.appendChild(noNotesDiv);
		} else {
			for (let i = 0; i < notesData.length; i++) {
				const noteData = notesData[i];
				const noteDiv = document.createElement("div");
				noteDiv.className = "note-display";

				const noteNumber = document.createElement("div");
				noteNumber.className = "note-number";
				noteNumber.textContent = "Note" + (i + 1);

				const noteContent = document.createElement("div");
				noteContent.className = "note-content";
				noteContent.textContent = noteData.content || "(Empty note";

				noteDiv.appendChild(noteNumber);
				noteDiv.appendChild(noteContent);
				this.notesDisplay.appendChild(noteDiv);
			}
		}
	}

	updateLastRetrieved() {
		const now = new Date();
		const timeString = now.toLocaleTimeString();
		this.lastRetrievedElement.textContent = UserMessages.reader.lastRetrieved + timeString;
	}
}

export const app = new ReaderApp();
app.init();
