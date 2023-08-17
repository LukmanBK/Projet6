// On déclare une variable globale contenant tout les travaux 
let works


// On récupère les travaux depuis l'API
async function getWorksDatas() {
    await fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => { 
        works = data
        showWorks(data)
      });
  }

  // On affiche les travaux dans la galerie
function showWorks (data) {
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
  console.log(works)
}

// On appelle la fonction qui récupère les travaux
 getWorksDatas();
 

