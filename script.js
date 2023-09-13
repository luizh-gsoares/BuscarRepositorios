// -------------------------------------------
//   Autor: Luiz Henrique Soares
//   Copyright (c) 2023 Luiz Henrique Soares
// -------------------------------------------


// Faz uma solicitação GET à API do GitHub para obter os repositórios de um determinado usuário.
function requestRepositorios(usuario) {
    return $.get(`https://api.github.com/users/${usuario}/repos`);
}

// Cria uma div com todas as informações do repositório recebido. Caso tenha mais informações do repositorio, basta adicionar no HTML.
// Acesse o link para ver todas as informações disponíveis: https://docs.github.com/en/rest/reference/repos#list-repositories-for-a-user
function criarRepositorioCard(repo) {
    var repo_topics = repo.topics || [];

    // Se o repositório tiver o tópico "esconder", ele não será exibido.
    if (repo_topics.includes("esconder")) {
        return null;
    }

    var repo_description = repo.description || "<p>Sem descrição.</p>";
    var repo_language = repo.language || "--";
    var repo_stars = repo.stargazers_count || 0;
    var repo_forks = repo.forks_count || 0;
    var repo_created_at = new Date(repo.created_at).toLocaleDateString();

    // Cria uma string com todos os tópicos do repositório.
    var topicsHTML = repo_topics.map(topic => `<span class='badge rounded-pill bg-dark'>${topic}</span>`).join(' ');

    return `
    <div class='col' id='${repo.id}'>
            <div class='card h-100'>
                <div class='card-body'>
                    <h5 class='card-title'><i class='fa-solid fa-book fa-lg'></i> ${repo.name}</h5>
                    ${topicsHTML}
                    <p class='card-text'>${repo_description}</p>
                    <p class='text-white'><a href='${repo.html_url}' class='stretched-link'></a></p>

                </div>
                <div class='card-footer'>
                    <small class='text-muted'> Criado em : ${repo_created_at}</small>
                    <small class='text-muted'><i class='fa-regular fa-star'></i> ${repo_stars}</small>
                    <small class='text-muted'><i class='fa-solid fa-code-fork'></i> ${repo_forks}</small>
                    <p class='text-muted'>Linguagem : ${repo_language}</p>
                </div>
            </div>
        </div>
    `;
}

// Exibe os repositórios recebidos na tela.
function exibirRepositorios(repositorios) {
    var repoContainer = $("#repo-container");
    if (!Array.isArray(repositorios) || !repositorios.length) {
        repoContainer.append("<div class='alert alert-danger'> Houve um erro ao listar os repositórios do GitHub.</div>");
    } else {
        for (var repo of repositorios) {
            var repoCardHTML = criarRepositorioCard(repo);
            if (repoCardHTML) {
                repoContainer.append(repoCardHTML);
            }
        }
    }
}

// Função para limpar os cards
function limparCards() {
    $("#repo-container").empty(); // Remove todos os elementos dentro de #repo-container
}

// Busca os repositórios do usuário informado e os exibe na tela.
function buscarRepositorios() {
    var usuario = $("#usuario-github").val() || "luizh-gsoares";    // Caso não seja informado um usuário, o padrão será "luizh-gsoares"
    limparCards();                                              // Chama a função para limpar os cards antes de fazer a nova busca


    requestRepositorios(usuario)
        .done(function (data) {
            var repositorios = data;
            exibirRepositorios(repositorios);
        })
        .fail(function () {
            $("#repo-container").append("<div class='alert alert-danger'> Houve um erro ao listar os repositórios do GitHub.</div>");
        });
}

// Chame a função buscarRepositorios() para iniciar o processo.
