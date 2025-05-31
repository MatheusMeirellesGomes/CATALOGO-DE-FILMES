document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado');

    // Verificar se moviesData está definido
    if (typeof moviesData === 'undefined') {
        console.error('moviesData não está definido. Verifique se movies.js foi carregado corretamente.');
        return;
    }
    console.log('moviesData:', moviesData);

    // Acessar o array de filmes
    const filmes = moviesData.movies;
    if (!filmes || !Array.isArray(filmes)) {
        console.error('Array de filmes não encontrado ou inválido');
        return;
    }
    console.log('Filmes:', filmes);

    // Função para contar gêneros
    function contarGeneros(filmes) {
        const generosContagem = {};
        filmes.forEach(filme => {
            if (filme.genres && Array.isArray(filme.genres)) {
                filme.genres.forEach(genero => {
                    generosContagem[genero] = (generosContagem[genero] || 0) + 1;
                });
            }
        });
        return generosContagem;
    }

    const generosContagem = contarGeneros(filmes);
    console.log('Contagem de gêneros:', generosContagem);

    if (Object.keys(generosContagem).length === 0) {
        console.error('Nenhum gênero encontrado nos dados');
        return;
    }

    // Preparar dados para o gráfico
    const labels = Object.keys(generosContagem);
    const data = Object.values(generosContagem);
    const cores = [
        '#e50914', // --primary
        '#b2070f', // --primary-dark
        '#2d2d2d', // --medium-gray
        '#e5e5e5', // --light-gray
        '#555555', // Cinza intermediário
        '#46d369', // Verde Netflix
    ];

    // Configurar o gráfico de pizza
    const canvas = document.getElementById('generosChart');
    if (!canvas) {
        console.error('Elemento canvas #generosChart não encontrado');
        return;
    }
    const ctx = canvas.getContext('2d');
    console.log('Contexto do canvas:', ctx);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: cores.slice(0, labels.length),
                borderColor: '#141414', // --black
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Netflix Sans',
                            size: 16
                        },
                        color: '#ffffff' // --white
                    }
                },
                tooltip: {
                    bodyFont: {
                        family: 'Netflix Sans',
                        size: 14
                    },
                    titleFont: {
                        family: 'Netflix Sans',
                        size: 16
                    },
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.raw;
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} filme(s) (${percentage}%)`;
                        }
                    }
                }
            },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const generoSelecionado = labels[index];
                    // Redireciona para catalogo.html com filtro por gênero
                    window.location.href = `catalogo.html?genero=${encodeURIComponent(generoSelecionado)}`;
                }
            }
        }
    });
});