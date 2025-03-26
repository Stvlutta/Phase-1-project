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

// State variables
let currentPage = 1;
let totalPages = 1;
let currentSearchQuery = '';
let currentGenre = '';
let currentYear = '';
let currentRating = '';
let movies = [];
let genres = [];
let watchlist = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') handleSearch();
});
filterButton.addEventListener('click', applyFilters);
prevPageButton.addEventListener('click', goToPrevPage);
nextPageButton.addEventListener('click', goToNextPage);
closeModalButton.addEventListener('click', closeModal);
window.addEventListener('click', e => {
    if (e.target === movieModal) closeModal();
});

// Tab navigation
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab
        button.classList.add('active');
        const tabContentId = button.getAttribute('data-tab') + '-content';
        document.getElementById(tabContentId).classList.add('active');
        
        // Update watchlist if needed
        if (button.getAttribute('data-tab') === 'watchlist') {
            renderWatchlist();
        }
    });
});

// Initialize application
async function initializeApp() {
    // Load genres
    await loadGenres();
    
    // Populate year filter (from current year back to 1950)
    populateYearFilter();
    
    // Load watchlist from localStorage
    loadWatchlist();
    
    // Load trending movies initially
    loadTrendingMovies();
}

// Populate year filter dropdown
function populateYearFilter() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1950; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

// Load genres from API
async function loadGenres() {
    try {
        const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        const data = await response.json();
        genres = data.genres;
        
        // Populate genre filter dropdown
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

// Load trending movies
async function loadTrendingMovies() {
    try {
        const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
        const data = await response.json();
        
        movies = data.results;
        totalPages = data.total_pages;
        renderMovies();
        updatePagination();
    } catch (error) {
        console.error('Error loading trending movies:', error);
    }
}
