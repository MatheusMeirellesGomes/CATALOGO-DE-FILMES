const API_URL = 'http://localhost:3000/filmes'; // URL do JSON Server

// Função para carregar os filmes na tabela
async function loadFilms() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar filmes');
    const films = await response.json();
    const tableBody = document.getElementById('filmsTable');
    tableBody.innerHTML = '';
    films.forEach(film => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${film.id}</td>
        <td>${film.title}</td>
        <td>${film.year}</td>
        <td>${film.genres.join(', ')}</td>
        <td>${film.rating}</td>
        <td>
          <button class="btn btn-sm btn-warning-custom me-2" onclick="editFilm(${film.id})">Editar</button>
          <button class="btn btn-sm btn-danger-custom" onclick="deleteFilm(${film.id})">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    alert('Não foi possível carregar os filmes. Verifique o servidor.');
  }
}

// Função para cadastrar ou atualizar um filme
async function saveFilm(event) {
  event.preventDefault();
  const id = document.getElementById('filmId').value;
  const title = document.getElementById('title').value;
  const year = document.getElementById('year').value;
  const genres = document.getElementById('genres').value.split(',').map(g => g.trim());
  const rating = document.getElementById('rating').value;
  const img = document.getElementById('img').value || '';
  const description = document.getElementById('description').value || '';

  const film = { title, year: parseInt(year), genres, rating: parseFloat(rating), img, description };

  try {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(film)
    });
    if (!response.ok) throw new Error('Erro ao salvar filme');
    resetForm();
    loadFilms();
  } catch (error) {
    console.error('Erro ao salvar filme:', error);
    alert('Erro ao salvar o filme. Tente novamente.');
  }
}

// Função para editar um filme
async function editFilm(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar filme');
    const film = await response.json();
    document.getElementById('filmId').value = film.id;
    document.getElementById('title').value = film.title;
    document.getElementById('year').value = film.year;
    document.getElementById('genres').value = film.genres.join(', ');
    document.getElementById('rating').value = film.rating;
    document.getElementById('img').value = film.img;
    document.getElementById('description').value = film.description;
    document.getElementById('submitBtn').textContent = 'Atualizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Erro ao editar filme:', error);
    alert('Erro ao carregar o filme para edição.');
  }
}

// Função para excluir um filme
async function deleteFilm(id) {
  if (!confirm('Tem certeza que deseja excluir este filme?')) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao excluir filme');
    loadFilms();
  } catch (error) {
    console.error('Erro ao excluir filme:', error);
    alert('Erro ao excluir o filme. Tente novamente.');
  }
}

// Função para resetar o formulário
function resetForm() {
  document.getElementById('filmForm').reset();
  document.getElementById('filmId').value = '';
  document.getElementById('submitBtn').textContent = 'Cadastrar';
}

// Adicionar eventos
document.getElementById('filmForm').addEventListener('submit', saveFilm);

// Carregar filmes ao iniciar
window.addEventListener('DOMContentLoaded', loadFilms);