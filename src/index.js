import './style.css';

function appendItem(item, iiif, id) {
  const list = document.getElementById('works');
  const li = document.createElement('li');
  li.innerHTML = `<div>
    <img src="${iiif}/${id}/full/843,/0/default.jpg" alt="${item.data.title}">
    <h4>${item.data.title}</h4>
    <p>by ${item.data.artist_title}</p><p class="medium">${item.data.medium_display}</p>
    <button>Comments</button>
    </div>`;
  list.append(li);
}

async function displayCat(apiLink) {
  const response = await fetch(`${apiLink}?fields=id,title,image_id,artist_title,medium_display`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'AIC-User-Agent': 'js capstone project (lgamino@centro.edu.mx)',
    },
  });

  const data = await response.json();

  const result = await data;

  const iiif = await data.config.iiif_url;
  const id = await data.data.image_id;

  appendItem(result, iiif, id);
}

async function callCats() {
  const cats = 'https://api.artic.edu/api/v1/artworks/search?q=modern&size=12';
  let catBox = [];

  const response = await fetch(cats, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'AIC-User-Agent': 'js capstone project (lgamino@centro.edu.mx)',
    },
  });

  const data = await response.json();
  // console.log(data)
  const result = await data.data;

  catBox = result.map((e) => e.api_link);

  catBox.forEach((e) => {
    displayCat(e);
  });
}

callCats();

const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('close');
closeButton.setAttribute('onclick', 'modal.remove(), overlay.remove()');
// closeButton.setAttribute('onclick', 'overlay.remove()');
