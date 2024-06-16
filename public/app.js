const mainContainer = document.querySelector(".mainContainer");
const search = document.querySelector(".searchInput input");
const searchResult = document.querySelector(".searchResult");
const contactList = document.querySelector(".contacts");

//Function called when a new contact is added
const generateTemplate = (contact) => {
  //html template added to mainContainer and searchContainer
  const mainContainerItem = `
        <li class="contact getInfo" data-id="${contact._id}">
        <div>
            <i class="fas fa-user userIcon"></i>
        </div>
        <div class="contact-info">
            <div class="fullName">${contact.prenom} ${contact.nom}</div>
            <br />
            <div class="description">${contact.entreprise}</div>
        </div>
        </li>
    `;

  const searchContainerItem = `
        <li class="searchItem getInfo" data-id="${contact._id}">${contact.prenom} ${contact.nom}</li>
    `;
  //html added to mainContainer and searchContainer
  const mainContainerList = document.querySelector(".contacts");
  mainContainerList.innerHTML += mainContainerItem;
  searchResult.innerHTML += searchContainerItem;

  const contactElements = document.querySelectorAll(".getInfo");
  contactElements.forEach((contactElement) => {
    contactElement.addEventListener("click", (event) => {
      event.stopPropagation();
      const contactId = contactElement.dataset.id;
      getContactDetails(contactId);
    });
  });
};

const displayContactInfoTemplate = (contact) => {
  const html = `
  <div class="contactDataContainer">
        <div class="navBarIcons">
        <div>
        <i class="fas fa-arrow-left navBarBtn" onclick="getContacts()"></i>
        </div>
        <div class="deleteEditIcons">
        <i class="fas fa-trash-alt delete" data-id="${contact._id}"></i>
        <i class="fas fa-edit edit" data-id="${contact._id}"></i>
        </div>
        </div>
        <div class="nameAndProfileIcon">
          <div>
            <i class="fas fa-user bigIcon"></i>
          </div>
          <div class="prenomNom">${contact.prenom} ${contact.nom}</div>
          <div class="entreprise">${contact.entreprise}</div>
        </div>
        <div class="phoneData">
          <div>
            <i class="fas fa-phone-alt"></i>
          </div>
          <div class="phoneNumber">
            <div class="telephone">${contact.telephone}</div>
          </div>
          <div>
            <i class="fas fa-phone-alt"></i>
            <i class="fas fa-comment-alt"></i>
          </div>
        </div>
        <div class="emailData">
          <div>
            <i class="fas fa-envelope"></i>
          </div>
          <div class="emailAdress">
            <div class="email">${contact.email}</div>
          </div>
          <div>
            <i class="fas fa-comment-alt"></i>
          </div>
        </div>
      </div>
  `;
  mainContainer.innerHTML = html;
  addDeleteEventListeners();
  addEditEventListener(contact);
};

//ADD NEW CONTACT

//Function called when newUser icon is clicked
const addContactTemplate = () => {
  //html template added to the mainContainer div
  const html = `
  <div class="addContactContainer">
    <div class="addNavBar">
      <i class="fas fa-arrow-left navBarBtn" onclick="getContacts()"></i>
      <i class="title">Créer un contact</i>
      <i class="fas fa-check checkIcon navBarBtn" onclick="postContact()"></i>
    </div>
    <ul>
      <li>
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Nom" />
        <i class="fas fa-times btnClear"></i>
      </li>
      <li>
        <i class="fas fa-user"></i>
        <input type="text" placeholder="Prénom" />
        <i class="fas fa-times btnClear"></i>
      </li>
      <li>
        <i class="fas fa-building"></i>
        <input type="text" placeholder="Entreprise" />
        <i class="fas fa-times btnClear"></i>
      </li>
      <li>
        <i class="fas fa-phone-alt"></i>
        <input type="text" placeholder="(514)-000-0000" />
        <i class="fas fa-times btnClear"></i>
      </li>
      <li>
      <i class="fas fa-phone-alt"></i>
      <input type="text" placeholder="mobile" />
      <i class="fas fa-times btnClear"></i>
      </li>
      <li>
        <i class="fas fa-envelope"></i>
        <input type="text" placeholder="nom@gmail.com" />
        <i class="fas fa-times btnClear"></i>
      </li>
      <li>
      <i class="fas fa-map-marker-alt"></i>
      <input type="text" placeholder="adresse" />
      <i class="fas fa-times btnClear"></i>
      </li>
    </ul>
    </div>
    `;
  //set the html to mainContainer
  mainContainer.innerHTML = html;
  //when called => corresponding field value is updated to -> ""
  clearFieldEventListener();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
//requête POST

//get value from each input and create a new contact in the database
function postContact(event) {
  //contact data values taken from each input of the addContactTemplate
  const prenom = document.querySelector('input[placeholder="Nom"]').value;
  const nom = document.querySelector('input[placeholder="Prénom"]').value;
  const entreprise = document.querySelector(
    'input[placeholder="Entreprise"]'
  ).value;
  const telephone = document.querySelector(
    'input[placeholder="(514)-000-0000"]'
  ).value;
  const mobile = document.querySelector('input[placeholder="mobile"]').value;
  const email = document.querySelector(
    'input[placeholder="nom@gmail.com"]'
  ).value;
  const adresse = document.querySelector('input[placeholder="adresse"]').value;

  //using POST to send contact details as json to the database
  fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prenom: prenom,
      nom: nom,
      entreprise: entreprise,
      telephone: telephone,
      mobile: mobile,
      email: email,
      adresse: adresse,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      //call getContacts() to refresh the contacts list
      getContacts();
    })
    .catch((error) => console.error(error));
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//afficher les contactes
//requête GET

//get the contacts stored in the database with a fetch request
const getContacts = () => {
  fetch("/api/contact")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((contacts) => {
      //clear mainContainer innerHtml
      mainContainer.innerHTML = "";

      //create and append ul element in maincontainer
      //mainUl => list for al the contacts in the main container
      const mainUl = document.createElement("ul");
      mainUl.classList.add("contacts");
      mainContainer.appendChild(mainUl);

      //clear searchResult innerHtml
      searchResult.innerHTML = "";

      //foreach contacts in the database : generateTemplate()
      contacts.forEach((contact) => {
        generateTemplate(contact);
      });

      //every time getContacts is called the search bar is refreshed by calling filterContacts()
      const term = search.value.trim().toLowerCase();
      filterContacts(term);
    })
    .catch((error) => console.error(error));
};

//when document is loaded : getContacts() is called
document.addEventListener("DOMContentLoaded", getContacts);

//////////////////////////////////////////////////////////////////////////////////////////////////////
//GET CONTACTS DETAIL WINDOW

//eventlistener => when a contact is clicked : getContactDetails() is called
const contacts = document.querySelectorAll(".contact");
contacts.forEach((contact) => {
  contact.addEventListener("click", (event) => {
    event.stopPropagation();
    const contactId = contact.dataset.id;
    getContactDetails(contactId);
  });
});

//go find the contact with the contactId given in the parameters
const getContactDetails = (contactId) => {
  fetch(`/api/contact/${contactId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((contact) => {
      //display the details template
      displayContactInfoTemplate(contact);
    })
    .catch((error) => console.error(error));
};

//on document load getContacts is called
document.addEventListener("DOMContentLoaded", getContacts);

//////////////////////////////////////////////////////////////////////////////////////////////////////
//requête DELETE

const deleteContact = (id) => {
  fetch(`/api/contact/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      getContacts(); // Refresh the todo list after deletion
    })
    .catch((error) => console.error(error));
};

const addDeleteEventListeners = () => {
  const deleteBtn = document.querySelector(".delete");
  deleteBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Stop event propagation
    const contactId = deleteBtn.getAttribute("data-id");
    if (contactId !== null && contactId !== undefined) {
      deleteContact(contactId);
    } else {
      console.error("Todo ID is null or undefined");
    }
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
//requête PUT

const editContact = (id) => {
  const prenomNom = document.getElementById("editPrenomNom").value.split(" ");
  const prenom = prenomNom[0];
  const nom = prenomNom[1];
  const entreprise = document.getElementById("editEntreprise").value;
  const telephone = document.getElementById("editTelephone").value;
  const email = document.getElementById("editEmail").value;

  fetch(`/api/contact/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nom: nom,
      prenom: prenom,
      entreprise: entreprise,
      telephone: telephone,
      email: email,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      getContacts();
    })
    .catch((error) => console.error(error));
};

const addEditEventListener = (contact) => {
  const editBtn = document.querySelector(".edit");
  editBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const contactData = mainContainer.querySelector(".contactDataContainer");
    const fullName = contactData.querySelector(".prenomNom");
    const description = contactData.querySelector(".entreprise");
    const phoneNumber = contactData.querySelector(".telephone");
    const emailAdress = contactData.querySelector(".email");

    fullName.innerHTML = `<input type="text" value="${contact.prenom} ${contact.nom}" id="editPrenomNom">`;
    description.innerHTML = `<input type="text" value="${contact.entreprise}" id="editEntreprise">`;
    phoneNumber.innerHTML = `<input type="text" value="${contact.telephone}" id="editTelephone">`;
    emailAdress.innerHTML = `<input type="text" value="${contact.email}" id="editEmail">`;

    // Ajoutez un bouton de soumission pour que l'utilisateur puisse envoyer les modifications
    contactData.innerHTML += `<button onclick="editContact('${contact._id}')">Enregistrer les modifications</button>`;
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////////
//SIDEBAR SCRIPT

//close and open the sidebar with this function =>
function toggleSidebar() {
  var sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("hidden");

  var mainContainer = document.querySelector(".mainContainer");
  if (sidebar.classList.contains("hidden")) {
    mainContainer.style.marginLeft = "0";
  } else {
    mainContainer.style.marginLeft = sidebar.offsetWidth + "px";
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//FILTER CONTACTS

//when called => value of search input are used to filtered
const filterContacts = (term) => {
  Array.from(searchResult.children)
    .filter((contact) => !contact.textContent.toLowerCase().includes(term))
    .forEach((contact) => contact.classList.add("filtered"));

  Array.from(searchResult.children)
    .filter((contact) => contact.textContent.toLowerCase().includes(term))
    .forEach((contact) => contact.classList.remove("filtered"));
};

// keyup event => whenever a key is pressed the eventListener is called
search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();
  filterContacts(term);
});

//////////////////////////////////////////////////////////////////////////////////////////////////////

//eventListener => clear button for search input
const clearFieldEventListener = () => {
  const clearBtn = document.querySelectorAll(".btnClear");
  clearBtn.forEach((clear) => {
    clear.addEventListener("click", (event) => {
      event.stopPropagation();
      const inputElement = clear.previousElementSibling;
      inputElement.value = "";
      const term = search.value.trim().toLowerCase();
      filterContacts(term);
    });
  });
};

//when called => corresponding field value is updated to -> ""
//this one is for the search bar only
clearFieldEventListener();
