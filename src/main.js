import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  renderGallery,
  clearGallery,
  toggleLoader,
  toggleLoadMoreBtn,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.btn-load');

let currentPage = 1;
let currentQuery = '';
const perPage = 15;

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

  const query = event.currentTarget.elements['search-text'].value.trim();

  if (query === '') {
    iziToast.warning({ message: 'Please enter a search query!' });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  toggleLoadMoreBtn(false);
  toggleLoader(true);

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, no images matching your query. Try again!',
      });
      return;
    }

    renderGallery(data.hits, false);

    // Логіка: якщо результатів мало — ховаємо кнопку і показуємо повідомлення одразу
    if (data.totalHits <= perPage) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      toggleLoadMoreBtn(true);
    }

    event.target.reset();
  } catch (error) {
    iziToast.error({ message: `Error: ${error.message}` });
  } finally {
    toggleLoader(false);
  }
}

async function handleLoadMore() {
  currentPage += 1;
  toggleLoadMoreBtn(false);
  toggleLoader(true);

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    renderGallery(data.hits, true);

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (currentPage >= totalPages) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      toggleLoadMoreBtn(true);
    }

    smoothScroll();
  } catch (error) {
    iziToast.error({ message: `Error: ${error.message}` });
  } finally {
    toggleLoader(false);
  }
}

function smoothScroll() {
  const card = document.querySelector('.gallery-item');
  if (card) {
    const cardHeight = card.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
