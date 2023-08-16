async function getWorksDatas() {
    await fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
  
      .then((data) => {
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
      });
  }

  getWorksDatas();

