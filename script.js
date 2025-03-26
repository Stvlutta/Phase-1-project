// API Configuration
const API_KEY = 'f67f9b6c561498d2026f52f33c952f90'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
const DEFAULT_POSTER = 'https://via.placeholder.com/300x450?text=No+Poster+Available';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const genreFilter = document.getElementById('genre-filter');
const yearFilter = document.getElementById('year-filter');
const ratingFilter = document.getElementById('rating-filter');
const filterButton = document.getElementById('filter-button');
const movieContainer = document.getElementById('movie-container');
const watchlistContainer = document.getElementById('watchlist-container');
const emptyWatchlist = document.getElementById('empty-watchlist');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');
const movieModal = document.getElementById('movie-modal');
const modalContent = document.getElementById('modal-content');
const closeModalButton = document.querySelector('.close');