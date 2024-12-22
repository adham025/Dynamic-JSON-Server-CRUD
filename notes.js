const apiBaseUrl = "http://localhost:5500/data";

let xhr = new XMLHttpRequest();
xhr.open("GET", `${apiBaseUrl}`);
xhr.send();

xhr.addEventListener("readystatechange", function (e) {
  if (xhr.readyState === 4 && xhr.status === 200) {
    let notes = JSON.parse(xhr.responseText);
    console.log(notes);
    getNotes(notes);
  }
});

function getNotes(notes) {
  let noteTableBody = document.querySelector("#note-table tbody");
  noteTableBody.innerHTML = "";

  notes.forEach((note) => {
    let row = document.createElement("tr");
    row.setAttribute("data-id", note.id); // Add data-id attribute
    console.log(note.id, note.title, note.description);
    row.innerHTML = `
    <td>${note.id}</td>
    <td>${note.title}</td>
    <td>${note.description}</td>
    <td>
        <button onclick="editNotes('${note.id}')">Edit</button>
        <button onclick="deleteNotes('${note.id}')">Delete</button>
    </td>
`;
    noteTableBody.appendChild(row);
  });
}

let form1 = document.getElementById("form");
form1.addEventListener("submit", function (e) {
  e.preventDefault();
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;

  if (title && description) {
    let data = { title: title, description: description };

    let postRequest = new XMLHttpRequest();
    postRequest.open("POST", `${apiBaseUrl}`);
    postRequest.setRequestHeader("Content-Type", "application/json");

    postRequest.onload = function () {
      if (postRequest.status === 201) {
        console.log("Note added:", postRequest.responseText);
        xhr.open("GET", `${apiBaseUrl}`);
        xhr.send();
      } else {
        console.error("Failed to add note:", postRequest.statusText);
      }
    };
    postRequest.send(JSON.stringify(data));
  } else {
    console.error("Both title and description are required.");
  }
});

function deleteNotes(id) {
  console.log(id);

  let xhrDelete = new XMLHttpRequest();
  xhrDelete.open("DELETE", `${apiBaseUrl}/${id}`, true);
  xhrDelete.onload = function () {
    if (xhrDelete.status === 200) {
      console.log(`Note with ID ${id} deleted successfully.`);
      let rowToDelete = document.querySelector(
        `#note-table tbody tr[data-id="${id}"]`
      );
      if (rowToDelete) {
        rowToDelete.remove();
      } else {
        console.error("Row not found for deletion.");
      }
    } else {
      console.error("Failed to delete note:", xhrDelete.statusText);
    }
  };

  xhrDelete.send();
}

function editNotes(id) {
  console.log(id);
  let newTitle = prompt("Enter new title:");
  while (!newTitle || newTitle.length < 6 || /\d/.test(newTitle)) {
    newTitle = prompt("Invalid title. Enter a new title :");
  }
  let newDescription = prompt("Enter new description:");
  while (!newDescription || newDescription.length < 20) {
    newDescription = prompt("Invalid description. Enter a new description :");
  }
  let updatedNote = {
    title: newTitle,
    description: newDescription,
  };

  let edited = new XMLHttpRequest();
  edited.open("PUT", `${apiBaseUrl}/${id}`, true);
  edited.setRequestHeader("Content-Type", "application/json");

  edited.onload = function () {
    if (edited.status === 200) {
      console.log(`Note with ID ${id} edited successfully.`);
      xhr.open("GET", `${apiBaseUrl}`);
      xhr.send();
    } else {
      console.error(`Failed to edit note with ID ${id}`);
    }
  };

  edited.send(JSON.stringify(updatedNote));
}
