import { UserMessages } from "../lang/messages/en/user.js";

export default class Note {
	constructor(id, content, storageManager) {
		this.id = id;
		this.content = content || "";
		this.storageManager = storageManager;
		this.textArea = null;
		this.removeButton = null;
		this.container = null;
	}

	createElements() {
		// create container div
		this.container = document.createElement("div");
		this.container.className = "note-item mb-3";
		this.container.dataset.noteId = this.id;

		// create textare
		this.textArea = document.createElement("textarea");
		this.textArea.className = "form-control note-textarea";
		this.textArea.value = this.content;
		this.textArea.placholder = UserMessages.common.notePlaceholder;
		this.textArea.rows = 4;

		// create remove button
		this.removeButton = document.createElement("button");
		this.removeButton.className = "btn btn-danger btn-sm mt-2";
		this.removeButton.textContent = UserMessages.writer.removeButton;

		// bind event listeners
		const self = this;
		this.textArea.addEventListener("input", function () {
			self.handleInput();
		});

		this.removeButton.addEventListener("click", function () {
			self.remove();
		});

		// append elements to container
		this.container.appendChild(this.textArea);
		this.container.appendChild(this.removeButton);

		return this.container;
	}

	handleInput() {
		this.content = this.textArea.value;
		this.storageManager.markDirty();
	}

	// method to remove notes
	remove() {
		// remove from DOM
		if (this.container && this.container.parentNode) {
			this.container.parentNode.removeChild(this.container);
		}

		// remove from local storage
		this.storageManager.removeNote(this.id);
	}

	getData() {
		return {
			id: this.id,
			content: this.content,
		};
	}
}
