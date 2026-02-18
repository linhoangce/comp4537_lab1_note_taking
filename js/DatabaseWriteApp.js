import { patientRecords } from "../lang/messages/en/user.js";

export default class DatabaseWriteApp {
	constructor() {
		this.queryInput = null;
		this.host = "https://comp4537-exexd9bdh3d6f7d9.canadacentral-01.azurewebsites.net/";
		this.insertEndpoint = "insertRecords";
		this.queryEndpoint = "mysqlQuery";
	}

	init() {
		this.queryInput = document.getElementById("user-query");
		this.insertBtn = document.getElementById("insert-btn");
		this.submitQueryBtn = document.getElementById("submit-query-btn");

		this.insertBtn.addEventListener("click", () => {
			this.insertData();
		});

		this.submitQueryBtn.addEventListener("click", () => {
			this.queryData();
			this.queryInput.value = "";
		});
	}

	insertData() {
		const xhttp = new XMLHttpRequest();
		const patientDict = patientRecords;

		xhttp.open("POST", this.host + this.insertEndpoint, true);
		xhttp.setRequestHeader("Content-Type", "application/json");

		xhttp.send(JSON.stringify(patientDict));

		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 201) {
				let response = JSON.parse(xhttp.responseText);
				document.getElementById("insert-response").textContent = response.message;
			}
		};
	}

	queryData() {
		const xhttp = new XMLHttpRequest();
		const sqlQuery = this.queryInput.value;
		const displayElement = document.getElementById("query-response");

		if (sqlQuery === "") {
			displayElement.innerHTML = "Please enter your query!";
			return;
		}

		// encode SQL query as a URL parameter
		const url = `${this.host}${this.queryEndpoint}?sql=${encodeURIComponent(sqlQuery)}`;

		xhttp.open("GET", url, true);
		xhttp.send();

		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				let response = JSON.parse(xhttp.responseText);
				document.getElementById("query-response").innerHTML =
					`<pre class="json-output">${JSON.stringify(response, null, 2)}</pre>`;
			} else if (xhttp.readyState == 4) {
				let errorMessage = xhttp.responseText;
				try {
					const errorObj = JSON.parse(errorMessage);
					errorMessage = errorObj.error || errorMessage;
				} catch (err) {
					console.error("Error parsing error response: ", err);
				}
				displayElement.innerHTML = `<div style="color: red;">Error ${xhttp.status}: ${errorMessage}</div>`;
			}
		};
	}
}

export const app = new DatabaseWriteApp();
app.init();
