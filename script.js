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

// Handle search
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    currentSearchQuery = query;
    currentPage = 1;
    
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`);
        const data = await response.json();
        
        movies = data.results;
        totalPages = data.total_pages;
        renderMovies();
        updatePagination();
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

// Apply filters
async function applyFilters() {
    currentGenre = genreFilter.value;
    currentYear = yearFilter.value;
    currentRating = ratingFilter.value;
    currentPage = 1;
    
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${currentPage}&sort_by=popularity.desc`;
    
    if (currentGenre) {
        url += `&with_genres=${currentGenre}`;
    }
    
    if (currentYear) {
        url += `&primary_release_year=${currentYear}`;
    }
    
    if (currentRating) {
        url += `&vote_average.gte=${currentRating}`;
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        movies = data.results;
        totalPages = data.total_pages;
        renderMovies();
        updatePagination();
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

// Render movies in the grid
function renderMovies() {
    // Clear container
    movieContainer.innerHTML = '';
    
    if (movies.length === 0) {
        movieContainer.innerHTML = '<p class="no-results">No movies found matching your criteria.</p>';
        return;
    }

// Create movie cards
movies.forEach(movie => {
    const inWatchlist = watchlist.some(item => item.id === movie.id);
    
    // Create movie card
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    
    // Create poster
    const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : DEFAULT_POSTER;
    
    // Build movie card HTML
    movieCard.innerHTML = `
        <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-rating">
                <i class="fas fa-star"></i>
                <span>${movie.vote_average.toFixed(1)}</span>
            </div>
            <div class="movie-year">
                ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </div>
            <button class="watchlist-btn ${inWatchlist ? 'in-watchlist' : ''}">
                <i class="fas ${inWatchlist ? 'fa-check' : 'fa-plus'}"></i>
                ${inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            </div>
        `;
    
    // Add event listeners to the movie card
    movieCard.querySelector('.movie-poster').addEventListener('click', () => openMovieDetail(movie.id));
    movieCard.querySelector('.movie-title').addEventListener('click', () => openMovieDetail(movie.id));
    movieCard.querySelector('.watchlist-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWatchlist(movie);
        const button = e.currentTarget;
        if (button.classList.contains('in-watchlist')) {
            button.classList.remove('in-watchlist');
            button.innerHTML = '<i class="fas fa-plus"></i> Add to Watchlist';
        } else {
            button.classList.add('in-watchlist');
            button.innerHTML = '<i class="fas fa-check"></i> In Watchlist';
        }
    });
    
    // Append to container
    movieContainer.appendChild(movieCard);
});
}

// Render watchlist
function renderWatchlist() {
    watchlistContainer.innerHTML = '';
    
    if (watchlist.length === 0) {
        emptyWatchlist.style.display = 'block';
        return;
    }
    
    emptyWatchlist.style.display = 'none';

    // Create movie cards for watchlist
    watchlist.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}w500${movie.poster_path}` : DEFAULT_POSTER;
        
        movieCard.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-rating">
                    <i class="fas fa-star"></i>
                    <span>${movie.vote_average.toFixed(1)}</span>
                </div>
                <div class="movie-year">
                    ${movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </div>
                <button class="watchlist-btn in-watchlist">
                    <i class="fas fa-trash"></i>
                    Remove
                </button>
            </div>
        `;
        
        // Add event listeners
        movieCard.querySelector('.movie-poster').addEventListener('click', () => openMovieDetail(movie.id));
        movieCard.querySelector('.movie-title').addEventListener('click', () => openMovieDetail(movie.id));
        movieCard.querySelector('.watchlist-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
            renderWatchlist();
        });
        
        // Append to container
        watchlistContainer.appendChild(movieCard);
    });
}

// Toggle movie in watchlist
function toggleWatchlist(movie) {
    const index = watchlist.findIndex(item => item.id === movie.id);
    
    if (index === -1) {
        // Add to watchlist
        watchlist.push(movie);
    } else {
        // Remove from watchlist
        watchlist.splice(index, 1);
    }
    
    // Save to localStorage
    saveWatchlist();
}