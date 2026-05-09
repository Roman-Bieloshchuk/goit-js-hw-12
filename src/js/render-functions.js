import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryContainer = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.btn-load');

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function renderGallery(images, isAppend = false) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" width="360"/>
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> <span>${likes}</span></p>
        <p class="info-item"><b>Views:</b> <span>${views}</span></p>
        <p class="info-item"><b>Comments:</b> <span>${comments}</span></p>
        <p class="info-item"><b>Downloads:</b> <span>${downloads}</span></p>
      </div>
    </li>`
    )
    .join('');

  if (isAppend) {
    galleryContainer.insertAdjacentHTML('beforeend', markup);
  } else {
    galleryContainer.innerHTML = markup;
  }

  lightbox.refresh();
}

export function clearGallery() {
  galleryContainer.innerHTML = '';
}

export function toggleLoader(isVisible) {
  loader.classList.toggle('is-hidden', !isVisible);
}

export function toggleLoadMoreBtn(isVisible) {
  loadMoreBtn.classList.toggle('is-hidden', !isVisible);
}
