import './style.css';
import count from './count';

const modal = (item, iiif, imageId, id) => {
  const { body } = document;
  const popUp = document.createElement('div');
  popUp.id = 'overlay';
  body.append(popUp);
  popUp.innerHTML = `
      <div id=${id} class="modal">
          <img src="${iiif}/${imageId}/full/843,/0/default.jpg" alt="${item.data.title}">
          <button id="close" onclick ="this.remove(), overlay.remove()">&times;</button>
        <h3>${item.data.title}</h3>
        <div id="info">
            <p>by ${item.data.artist_title}</p>
            <p>${item.data.medium_display}</p>
        </div>
        <div id="comments">
            <h4>Comments (num)</h4>
            <ul>
                <li>
                    <p>Comment</p>
                </li>
                <li>
                    <p>Comment</p>
                </li>
                <li>
                    <p>Comment</p>
                </li>
            </ul>
        </div>
        <div id="addComment">
            <h4>Add a comment</h4>
            <form action="post">
                <input type="text" id="user" name="user" placeholder="Your name">
                <input type="text" id="comment" name="comment" placeholder="Your insights">
                <button type="submit" id="addButton">comment</button>
            </form>
        </div>
    </div>`;
};

async function postLike(id) {
  const url = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/YJy8zKJ52VhnTL91oel8/likes/';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'AIC-User-Agent': 'js capstone project (lgamino@centro.edu.mx)',
    },
    body: JSON.stringify({
      item_id: `${id}`,
    }),
  });
  return (response);
  // const data = await response.text();
  // const result = await data.data;
}

const increaseLikes = (id) => {
  const item = document.getElementById(`${id}`).children[0].children[4].children[1];
  let likes = Number(item.innerHTML);
  likes += 1;
  item.innerHTML = likes;
};

async function getLikes() {
  const url = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/YJy8zKJ52VhnTL91oel8/likes/';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'AIC-User-Agent': 'js capstone project (lgamino@centro.edu.mx)',
    },
  });

  const data = await response.json();

  return data;
}

const findLikes = (data, id) => {
  let result = data.find((e) => Number(e.item_id) === id);
  if (result === undefined) {
    result = { item_id: id, likes: 0 };
  }
  return result.likes;
};

async function run(id) {
  const data = await getLikes();
  return findLikes(data, id);
}

const updateHeader = (count) => {
  document.getElementById('counter').innerHTML = count;
};

async function appendItem(item, iiif, imageId, id) {
  const list = document.getElementById('works');
  const li = document.createElement('li');
  const div = document.createElement('div');
  const div1 = document.createElement('div');
  const img = document.createElement('img');
  const button = document.createElement('button');
  const likes = await run(id);
  const like = document.createElement('span');
  div1.id = 'buttons';
  like.classList.add('material-icons');
  like.id = id;
  like.textContent = 'favorite_border';
  li.id = id;
  li.append(div);
  div.innerHTML = `
    <img src="${iiif}/${imageId}/full/843,/0/default.jpg" alt="${item.data.title}">
    <h4>${item.data.title}</h4>
    <p>by ${item.data.artist_title}</p>
    <p class="medium">${item.data.medium_display}</p>
    <div id="likes">
      <p>likes: </p>
      <p>${likes}</p>
    <div>`;
  div.append(div1);
  div1.append(button, like);
  img.src = `${iiif}/${imageId}/full/843,/0/default.jpg`;
  img.alt = `${item.data.title}`;
  button.id = id;
  button.class = 'commentButton';
  button.textContent = 'Comments';
  list.append(li);
  button.addEventListener('click', () => { modal(item, iiif, imageId, id); });
  like.addEventListener('click', () => {
    postLike(id);
    increaseLikes(id);
  });
  updateHeader(count());
}

async function displayItem(apiLink) {
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
  const imageId = await data.data.image_id;
  const id = await data.data.id;

  appendItem(result, iiif, imageId, id);
}

async function call() {
  const url = 'https://api.artic.edu/api/v1/artworks/search?q=modern&size=12';
  let itemsArray = [];

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'AIC-User-Agent': 'Microverse student project (lgamino@centro.edu.mx)',
    },
  });

  const data = await response.json();
  const result = await data.data;

  itemsArray = result.map((e) => e.api_link);

  itemsArray.forEach((e) => {
    displayItem(e);
  });
}

call();

// key: YJy8zKJ52VhnTL91oel8
