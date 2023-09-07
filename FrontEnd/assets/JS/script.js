// On déclare une variable globale contenant tout les travaux
let works;

// On récupère les travaux depuis l'API
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

    gallery.appendChild(figureElement);
    figureElement.appendChild(figureImg);
    figureElement.appendChild(figureCaption);
  });
}

// On appelle la fonction qui récupère les travaux
getWorksDatas();

//// FILTRES ////

// On déclare un tableau qui sert à stocker les éléments de filtre crées
const filtersArray = [];

// On définit la fonction permettant de créer les éléments de filtre et de gérer les interactions liées aux filtres
async function createFilters() {
  const filterSection = document.querySelector(".filters");
  const filterAll = document.createElement("div");
  filterAll.classList.add("filter");
  filterAll.setAttribute("id", "selected");
  filterAll.innerText = "Tous";
  filterSection.appendChild(filterAll);
  filtersArray.push(filterAll);
  const gallery = document.querySelector(".gallery");

  // On déclare une variable pour suivre l'indice du filtre actuellement séléctionné
  let selectedFilterIndex = 0;

  // On récupère les données des travaux via une requête vers l'API
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

      // Création d'un tableau contenant les catégories uniques disponibles dans les données de travaux
      const categories = Array.from(categoriesSet);

      // Boucle parcourant chaque catégorie unique présente dans le tableau "catégories"
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

  //Fonction pour mettre à jour le filtre sélectionné
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

// Mode édition lorsque le token est actif
const token = localStorage.getItem("token");
if (token) {
  // Fonction responsable de l'affichage du "mode édition"
  function editMode() {
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

  editMode();

  // On crée le logout pour donner la possibilité de se déconnecter
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.innerText = "logout";
  loginBtn.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
} else {
  // Appel de la fonction pour initialiser la création des filtres de catégories dans la galerie de travaux
  createFilters();
}
