const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));

function loadFavoriteMovies() {
    const section = document.getElementById('favoriteMovies');
    if (!section) return;

    const favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    const favoriteMovies = moviesData.movies.filter(movie => favoriteIds.includes(movie.id));

    section.innerHTML = favoriteMovies.length > 0 ? favoriteMovies.map(movie => `
        <div class="movie">
            <img src="${movie.img}" class="w-100" alt="${movie.title}" 
                 onclick="showMovieInfo(${movie.id})">
            <div class="movie-info">
                <h3>${movie.title.split(':')[1] ? movie.title.split(':')[1].trim() : movie.title}</h3>
                <p>${movie.rating} relevante</p>
                <button class="btn btn-sm btn-outline-light" onclick="toggleFavorite(${movie.id})">
                    <i class="bi bi-star-fill"></i> Remover dos Favoritos
                </button>
            </div>
        </div>
    `).join('') : '<p class="text-center">Nenhum filme favoritado ainda.</p>';
}

function toggleFavorite(movieId) {
    let favoriteIds = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    if (favoriteIds.includes(movieId)) {
        favoriteIds = favoriteIds.filter(id => id !== movieId);
    } else {
        favoriteIds.push(movieId);
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteIds));
    const movie = moviesData.movies.find(m => m.id === movieId);
    if (movie) {
        alert(`${movie.title} foi ${favoriteIds.includes(movieId) ? 'adicionado aos' : 'removido dos'} favoritos!`);
    }
    loadFavoriteMovies();
}

function showMovieInfo(movieId) {
    const movie = moviesData.movies.find(m => m.id === movieId);
    if (!movie) return;

    document.getElementById('movieModalTitle').textContent = movie.title;
    document.getElementById('movieModalImage').src = movie.img;
    document.getElementById('movieModalImage').alt = movie.title;
    document.getElementById('movieModalDescription').textContent = movie.description;
    document.getElementById('movieModalYear').textContent = movie.year;
    document.getElementById('movieModalDuration').textContent = movie.duration;
    document.getElementById('movieModalRating').textContent = `${movie.rating} relevante`;

    const genresContainer = document.getElementById('movieModalGenres');
    genresContainer.innerHTML = movie.genres.map(g => 
        `<span class="badge bg-info text-dark me-1">${g}</span>`
    ).join('');

    const moreInfoBtn = document.getElementById('movieModalMoreInfoBtn');
    moreInfoBtn.onclick = () => showMoreInfo(movieId);

    movieModal.show();
}

function showMoreInfo(movieId) {
    const movie = moviesData.movies.find(m => m.id === movieId);
    if (!movie) return;

    if ([15, 16, 17].includes(movie.id)) {
        alert('Página em construção. Este filme estará disponível em breve!');
        return;
    }

    window.location.href = `detalhes.html?id=${movieId}`;
}