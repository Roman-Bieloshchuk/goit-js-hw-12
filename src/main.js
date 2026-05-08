import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';

const searchForm = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.btn-load');

let currentPage = 1;
let currentQuery = '';
const perPage = 15;

const showLoadMoreBtn = () => loadMoreBtn.classList.remove('is-hidden');
const hideLoadMoreBtn = () => loadMoreBtn.classList.add('is-hidden');

searchForm.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSearch(event) {
  event.preventDefault();

  const query = event.currentTarget.elements['search-text'].value.trim();

  if (query === '') {
    iziToast.error({ message: 'Please enter a search query!' });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(data.hits);

    if (data.totalHits > perPage) {
      showLoadMoreBtn();
    }
  } catch (error) {
    iziToast.error({ message: `Error: ${error.message}` });
  } finally {
    hideLoader();
    event.target.reset();
  }
}

async function handleLoadMore() {
  currentPage += 1;
  hideLoadMoreBtn();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    const totalPages = Math.ceil(data.totalHits / perPage);

    if (currentPage >= totalPages) {
      hideLoadMoreBtn();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomRight',
      });
    } else {
      showLoadMoreBtn();
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      const cardHeight = galleryItems[0].getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    iziToast.error({ message: `Error: ${error.message}` });
  } finally {
    hideLoader();
  }
}
