// On declare une variable globale contenant tout les travaux
let works;

// On recupere les travaux depuis l'API
async function getWorksDatas() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      works = data;
      showWorks(data);
    });
}

// On affiche les travaux dans la galerie
function showWorks(data) {
  const gallery = document.querySelector(".gallery");
  data.forEach((item) => {
    const figureElement = document.createElement("figure");
    const figureImg = document.createElement("img");
    figureImg.src = item.imageUrl;
    const figureCaption = document.createElement("figcaption");
    figureCaption.innerText = item.title;
    const dynamicId = item.id;
    const concatenedId = "figureForMainPage" + dynamicId;
    figureElement.id = concatenedId;

    gallery.appendChild(figureElement);
    figureElement.appendChild(figureImg);
    figureElement.appendChild(figureCaption);
  });
}

// On appelle la fonction qui recupere les travaux
getWorksDatas();

//// FILTRES ////

// On declare un tableau qui sert à stocker les elements de filtre crees
const filtersArray = [];

// On definit la fonction permettant de créer les elements de filtre et de gérer les interactions liees aux filtres
async function createFilters() {
  const filterSection = document.querySelector(".filters");
  const filterAll = document.createElement("div");
  filterAll.classList.add("filter");
  filterAll.setAttribute("id", "selected");
  filterAll.innerText = "Tous";
  filterSection.appendChild(filterAll);
  filtersArray.push(filterAll);
  const gallery = document.querySelector(".gallery");

  // On declare une variable pour suivre l'indice du filtre actuellement selectionne
  let selectedFilterIndex = 0;

  // On recupere les donnees des travaux via une requete vers l'API
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const categoriesSet = new Set();

      data.forEach((item) => {
        const { name } = item.category;
        categoriesSet.add(name);
      });

      // Ajout d'un event listener sur le filtre "Tous"
      filterAll.addEventListener("click", function () {
        gallery.innerHTML = "";
        getWorksDatas();
      });

      // Creation d'un tableau contenant les catégories uniques disponibles dans les données de travaux
      const categories = Array.from(categoriesSet);

      // Boucle parcourant chaque categorie unique présente dans le tableau "categories"
      categories.forEach((category) => {
        const filter = document.createElement("div");
        filter.classList.add("filter");
        filter.innerText = category;
        filterSection.appendChild(filter);
        filtersArray.push(filter);

        // Fonction de tri par filtres
        filter.addEventListener("click", function (event) {
          const selectedFilter = event.target;
          const selectedCategory = selectedFilter.innerText;
          gallery.innerHTML = "";
          let worksToDisplay = [];

          worksToDisplay = data.filter(
            (item) => item.category.name === selectedCategory
          );

          worksToDisplay.forEach((item) => {
            const figureElement = document.createElement("figure");
            const figureImg = document.createElement("img");
            figureImg.src = item.imageUrl;
            const figureCaption = document.createElement("figcaption");
            figureCaption.innerText = item.title;
            gallery.appendChild(figureElement);
            figureElement.appendChild(figureImg);
            figureElement.appendChild(figureCaption);
          });
        });
      });
    });

  //Fonction pour mettre à jour le filtre selectionne
  function updateSelectedFilter(index) {
    for (let i = 0; i < filtersArray.length; i++) {
      if (i === index) {
        filtersArray[i].setAttribute("id", "selected");
      } else {
        filtersArray[i].removeAttribute("id");
      }
    }
  }

  filterSection.addEventListener("click", function (event) {
    const selectedFilter = event.target;
    const index = filtersArray.indexOf(selectedFilter);
    if (index !== -1) {
      updateSelectedFilter(index, selectedFilterIndex);
    }
  });
}

/// Mode édition ///

// Fonction responsable de l'affichage du "mode édition"
function editMode() {
  //Affichage du bouton "mode édition et de l'icône"
  const editModeDiv = document.getElementById("editMode");
  editModeDiv.style.display = "flex";
  editModeDiv.classList.add("editorBar");
  const editorIcon = document.createElement("i");
  editorIcon.classList.add("fa-regular", "fa-pen-to-square");
  editModeDiv.appendChild(editorIcon);

  //Affichage du bouton "publier les changements"
  const publishBtn = document.createElement("div");
  publishBtn.classList.add("publishBtn");
  editModeDiv.appendChild(publishBtn);
  const publishText = document.createElement("p");
  publishText.innerText = "publier les changements";
  publishText.classList.add("publishText");
  publishBtn.appendChild(publishText);

  //Affichage des deux boutons "modifier"
  const modifyBtnIntro = document.querySelector(".pictureIntro");
  insertBtnModify(modifyBtnIntro, "13px 0 0 55px");
  const modifyBtnProjects = document.querySelector(".projectsTitle");
  insertBtnModify(modifyBtnProjects, "10px 0");

  function insertBtnModify(targetSection, marginValue) {
    const modifyBtn = document.createElement("div");
    modifyBtn.classList.add("buttonModify");
    modifyBtn.addEventListener("click", generateAndOpenModal);

    const editorIcon = document.createElement("i");
    editorIcon.classList.add("fa-regular", "fa-pen-to-square");
    modifyBtn.appendChild(editorIcon);

    const modifyBtnText = document.createElement("p");
    modifyBtnText.innerText = "modifier";
    modifyBtn.appendChild(modifyBtnText);

    modifyBtn.style.margin = marginValue;

    targetSection.appendChild(modifyBtn);
  }
}

const token = localStorage.getItem("token");
if (token) {
  // On appelle la fonction permettant l'affichage du mode édition
  editMode();

  // On a l'option logout qui apparait pour donner la possibilité de se deconnecter
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.innerText = "logout";
  loginBtn.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
} else {
  // Si le token n'est pas actif , on appelle la fonction pour initialiser la creation des filtres de categories dans la galerie de travaux
  createFilters();
}

// Declaration des variables pour les modales
let modal;
let secondModal;

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function openSecondModal() {
  secondModal.style.display = "block";
}

function closeSecondModal() {
  secondModal.style.display = "none";
}

function escapeClose(e) {
  if (e.keyCode === 27) {
    closeModal();
    closeSecondModal();
  }
}

function generateAndOpenModal() {
  if (modal) {
    document.body.removeChild(modal);
  }

  modal = generateModal();
  document.body.appendChild(modal);
  openModal();
  getWorksDatasForModal();
}

function generateAndOpenSecondModal() {
  if (secondModal) {
    document.body.removeChild(secondModal);
  }

  secondModal = generateSecondModal();
  document.body.appendChild(secondModal);
  openSecondModal();
}

// Fonction pour générer le contenu de la première modale
function generateModal() {
  // Créations des differents elements dans le dom
  modal = document.createElement("div");
  modal.classList.add("modal");

  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");
  modalBackground.addEventListener("click", closeModal);
  modal.appendChild(modalBackground);

  const modalWindow = document.createElement("div");
  modalWindow.classList.add("modal-window");
  modal.appendChild(modalWindow);

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("closeBtn");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", closeModal);
  modalWindow.appendChild(closeBtn);

  const modalTitle = document.createElement("h3");
  modalTitle.innerText = "Galerie photo";
  modalWindow.appendChild(modalTitle);

  const modalGallery = document.createElement("div");
  modalGallery.classList.add("modal-gallery");
  modalWindow.appendChild(modalGallery);

  const hr = document.createElement("hr");
  modalWindow.appendChild(hr);

  const addPhotoButton = document.createElement("div");
  addPhotoButton.classList.add("addPhotoButton");
  addPhotoButton.addEventListener("click", function () {
    closeModal();
    generateAndOpenSecondModal();
  });
  modalWindow.appendChild(addPhotoButton);

  const addPhotoText = document.createElement("p");
  addPhotoText.innerText = "Ajouter une photo";
  addPhotoButton.appendChild(addPhotoText);

  // Fermeture de la modale si l'utilisateur appuie sur "echap"
  window.addEventListener("keyup", escapeClose);

  return modal;
}

// On recupere les données des travaux via une requete vers l'API
async function getWorksDatasForModal() {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      const modalGallery = document.querySelector(".modal-gallery");
      modalGallery.innerHTML = "";

      // Boucle pour afficher les données dans la modale
      data.forEach((item, index) => {
        const figureElement = document.createElement("figure");
        figureElement.classList.add("figureForModal");
        const dynamicId = item.id;
        const concatenedId = "figureForModal" + dynamicId;
        figureElement.id = concatenedId;
        figureElement.dataset.id = item.id;
        modalGallery.appendChild(figureElement);

        const figureImg = document.createElement("img");
        figureImg.src = item.imageUrl;
        figureImg.classList.add("imgForModal");
        figureElement.appendChild(figureImg);

        const trashContainer = document.createElement("div");
        trashContainer.classList.add("figureContainer", "trashContainer");
        figureElement.appendChild(trashContainer);

        const trashElement = document.createElement("i");
        trashElement.classList.add("fa-solid", "fa-trash-can");
        trashContainer.appendChild(trashElement);

        // Appel a la fonction de suppression au click sur icone corbeille
        trashContainer.addEventListener("click", async function (event) {
          //// supprime l'element du DOM immédiatement
          figureElement.parentNode.removeChild(figureElement);
          await deleteElementById(item.id, true);
          const idToDelete = item.id;
          await deleteElementById(idToDelete);
          const elementToRemoveFromMainPage = document.querySelector(
            `[data-id="${idToDelete}"]`
          );
          if (elementToRemoveFromMainPage) {
            elementToRemoveFromMainPage.parentNode.removeChild(
              elementToRemoveFromMainPage
            );
          }
        });
      });
    });
}

// Fonction de suppression d'un projet en fonction de son id
async function deleteElementById(id, removeFromModal) {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const elementToRemove = document.getElementById("figureForMainPage" + id);
    if (elementToRemove) {
      elementToRemove.parentNode.removeChild(elementToRemove);
    }
    if (removeFromModal) {
      const elementToRemoveFromModal = document.getElementById(
        "figureForModal" + id
      );
      if (elementToRemoveFromModal) {
        elementToRemoveFromModal.parentNode.removeChild(
          elementToRemoveFromModal
        );
      }
    }
  }
}

// Fonction pour créer le formulaire d'ajout de photo dans la seconde modale
function createAddPhotoForm() {
  const addPhotoForm = document.createElement("form");
  addPhotoForm.classList.add("addPhotoForm");

  const formTitleContainer = document.createElement("div");
  formTitleContainer.classList.add("formTitleContainer");
  addPhotoForm.appendChild(formTitleContainer);

  const modalTitle = createFormTitle("Ajout photo");
  formTitleContainer.appendChild(modalTitle);

  return addPhotoForm;
}

function createFormTitle(titleText) {
  const modalTitle = document.createElement("h3");
  modalTitle.classList.add("addPhotomodalTitle");
  modalTitle.innerText = titleText;

  return modalTitle;
}

// Fonction pour générer le contenu de la seconde modal
function generateSecondModal() {
  // Creation des differents éléments dans le dom
  secondModal = document.createElement("div");
  secondModal.classList.add("modal");
  document.body.appendChild(secondModal);

  const modalBackground = document.createElement("div");
  modalBackground.classList.add("modal-background");
  modalBackground.addEventListener("click", closeSecondModal);
  secondModal.appendChild(modalBackground);

  const modalWindow = document.createElement("div");
  modalWindow.classList.add("modal-window");
  secondModal.appendChild(modalWindow);

  const addPhotoForm = createAddPhotoForm();
  modalWindow.appendChild(addPhotoForm);

  const iconBar = document.createElement("div");
  iconBar.classList.add("iconBar");
  modalWindow.appendChild(iconBar);

  const backButton = document.createElement("i");
  backButton.classList.add("fa-solid", "fa-arrow-left");
  backButton.addEventListener("click", function () {
    closeSecondModal();
    generateAndOpenModal();
  });
  iconBar.appendChild(backButton);

  const closeBtn = document.createElement("span");
  closeBtn.classList.add("closeBtn");
  closeBtn.innerHTML = "&times;";
  closeBtn.addEventListener("click", closeSecondModal);
  iconBar.appendChild(closeBtn);

  const formTitleContainer = document.createElement("div");
  formTitleContainer.classList.add("formTitleContainer");
  addPhotoForm.appendChild(formTitleContainer);

  const uploadPhotoContainer = document.createElement("div");
  uploadPhotoContainer.classList.add("uploadPhotoContainer");
  addPhotoForm.appendChild(uploadPhotoContainer);

  const uploadPhotoIcon = document.createElement("i");
  uploadPhotoIcon.classList.add("fa-solid", "fa-image");
  uploadPhotoContainer.appendChild(uploadPhotoIcon);

  const uploadPhotoButtonContainer = document.createElement("div");
  uploadPhotoButtonContainer.classList.add("uploadPhotoButtoncontainer");
  uploadPhotoContainer.appendChild(uploadPhotoButtonContainer);

  const uploadPhotoButton = document.createElement("input");
  uploadPhotoButton.classList.add("uploadPhotoButton");
  uploadPhotoButton.type = "file";
  uploadPhotoButton.id = "photo";
  uploadPhotoButton.accept = ".jpg, .png";
  uploadPhotoButtonContainer.appendChild(uploadPhotoButton);

  const uploadPhotodescription = document.createElement("p");
  uploadPhotodescription.classList.add("uploadPhotodescription");
  uploadPhotodescription.innerText = "jpg, png : 4mo max";
  uploadPhotoContainer.appendChild(uploadPhotodescription);

  const uploadPhotoButtonText = document.createElement("label");
  uploadPhotoButtonText.classList.add("uploadPhotoButtonText");
  uploadPhotoButtonText.setAttribute("for", "photo");
  uploadPhotoButtonText.textContent = "+ Ajouter photo";
  uploadPhotoButtonContainer.appendChild(uploadPhotoButtonText);

  const addProjectMessage = document.createElement("p");
  addProjectMessage.classList.add("addProjectMessage");
  addProjectMessage.innerText = "Le projet a été ajouté avec succès !";
  addPhotoForm.appendChild(addProjectMessage);

  // Prévisualisation de l'image avant telechargement
  let img;

  uploadPhotoButton.addEventListener("input", () => {
    const photoPreview = new FileReader();
    photoPreview.readAsDataURL(uploadPhotoButton.files[0]);

    photoPreview.addEventListener("load", () => {
      const invalidFile = document.querySelector(".invalidFile");
      var fileInput = document.getElementById("photo");
      var file = fileInput.files[0];

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        invalidFile.innerText = "Veuillez sélectionner un fichier JPG ou PNG.";
      } else if (file.size > 4 * 1024 * 1024) {
        invalidFile.innerText =
          "Veuillez sélectionner un fichier de moins de 4 Mo.";
      } else {
        invalidFile.innerText = "";
        const url = photoPreview.result;
        img = new Image();
        img.classList.add("photoPreviewImg");
        img.src = url;
        uploadPhotoContainer.appendChild(img);
        return img;
      }
    });
  });

  const invalidFile = document.createElement("p");
  invalidFile.innerText = "";
  invalidFile.classList.add("invalidFile");
  addPhotoForm.appendChild(invalidFile);

  const titleLabel = document.createElement("label");
  titleLabel.classList.add("titleLabel");
  titleLabel.textContent = "Titre";
  addPhotoForm.appendChild(titleLabel);

  const nameInput = document.createElement("input");
  nameInput.classList.add("nameInput");
  nameInput.type = "text";
  nameInput.name = "titre";
  addPhotoForm.appendChild(nameInput);

  // Menu deroulant pour le choix de la categorie de l'element
  const categoryLabel = document.createElement("Label");
  categoryLabel.classList.add("categoryLabel");
  categoryLabel.innerText = "Catégorie";
  addPhotoForm.appendChild(categoryLabel);

  // Creation du selecteur de categorie
  let categoryNames = "";
  let categoryId = "";

  const categorySelect = document.createElement("select");
  categorySelect.name = "Categorie";
  categorySelect.classList.add("categorySelect");
  addPhotoForm.appendChild(categorySelect);

  const initialOption = document.createElement("option");
  initialOption.value = "";
  categorySelect.appendChild(initialOption);

  async function loadCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      const data = await response.json();

      data.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  }

  loadCategories();

  // Creation dynamique des differentes categories
  categorySelect.addEventListener("change", () => {
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    categoryNames = selectedOption.text;
    categoryId = selectedOption.value;
    updateSendButtonId();
  });

  const hr = document.createElement("hr");
  addPhotoForm.appendChild(hr);

  // Fonction mettant a jour le bouton valider quand les donnees sont precharges
  function updateSendButtonId() {
    const uploadPhotoFiles = uploadPhotoButton.files;
    const isNameInputFilled = nameInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";

    if (
      uploadPhotoFiles.length > 0 &&
      isNameInputFilled &&
      isCategorySelected
    ) {
      sendButton.id = "buttonReadyToWork";
    } else {
      sendButton.id = "";
    }
  }

  uploadPhotoButton.addEventListener("change", updateSendButtonId);
  nameInput.addEventListener("input", updateSendButtonId);
  categorySelect.addEventListener("change", updateSendButtonId);

  // Creation du bouton "valider" pour soumettre le formulaire
  const sendButton = document.createElement("button");
  const gallery = document.querySelector(".gallery");
  sendButton.type = "submit";
  sendButton.classList.add("sendButton");
  addPhotoForm.appendChild(sendButton);

  // Gestion de la soumission du formulaire d'ajout de photo
  sendButton.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      await postDatas();
      img.remove();
      nameInput.value = "";
      categorySelect.selectedIndex = 0;
      sendButton.removeAttribute("id");
      gallery.innerHTML = "";
      await getWorksDatas();
      addProjectMessage.style.display = "block";
    } catch (error) {
      console.log("Erreur d'upload: ", error);
    }
  });

  // Fonction d'envoi des elements dans la base de donnees
  async function postDatas() {
    return new Promise((resolve) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", uploadPhotoButton.files[0]);
      formData.append("title", nameInput.value);
      formData.append("category", categoryId);

      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((response) => {
        if (response.status === 201) {
          resolve();
        }
      });
    });
  }

  // On cree le texte pour le bouton "Valider"
  const sendButtonText = document.createElement("p");
  sendButtonText.classList.add("sendButtonText");
  sendButtonText.innerText = "Valider";
  sendButton.appendChild(sendButtonText);

  window.addEventListener("keyup", escapeClose);

  modalWindow.appendChild(addPhotoForm);

  return secondModal;
}
