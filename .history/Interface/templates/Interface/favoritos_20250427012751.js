async function favoritar(destinoNome) {
    try {
      const response = await fetch("/favoritos/adicionar/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ destino: destinoNome }),
      });
      if (response.ok) {
        atualizarFavoritos();
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    }
  }
  
  async function desfavoritar(destinoNome) {
    try {
      const response = await fetch("/favoritos/remover/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ destino: destinoNome }),
      });
      if (response.ok) {
        atualizarFavoritos();
      }
    } catch (error) {
      console.error("Erro ao desfavoritar:", error);
    }
  }
  
  async function atualizarFavoritos() {
    const lista = document.getElementById("favoritosList");
    lista.innerHTML = "";
  
    try {
      const response = await fetch("/favoritos/listar/");
      if (response.ok) {
        const favoritos = await response.json();
        favoritos.forEach(destino => {
          const li = document.createElement("li");
          li.className = "bg-blue-600 p-2 rounded-lg text-white flex justify-between items-center";
          li.innerHTML = `
            <span>${destino}</span>
            <button onclick="desfavoritar('${destino}')" class="text-red-300 hover:text-red-500 text-lg ml-4" title="Desfavoritar">🗑️</button>
          `;
          lista.appendChild(li);
        });
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }
  
  // Função para pegar o token CSRF do Django
  function getCSRFToken() {
    const name = "csrftoken=";
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      while (cookie.charAt(0) == " ") cookie = cookie.substring(1);
      if (cookie.indexOf(name) == 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return "";
  }
  
  // Quando a página carregar, já mostra os favoritos salvos
  window.onload = function() {
    exibirTodosDestinos();
    atualizarFavoritos();
  };
  
  // Função para montar os cards de destinos (igual você já tinha)
  function exibirTodosDestinos() {
    const destinos = [...]; // <-- coloca aqui o seu array de destinos que você já tem
    const container = document.getElementById('destinosContainer');
    container.innerHTML = "";
  
    destinos.forEach(destino => {
      const card = document.createElement('div');
      card.className = "bg-gray-800 rounded-lg shadow-md p-4";
  
      card.innerHTML = `
        <img src="${destino.imagem}" alt="${destino.nome}" class="w-full h-48 object-cover rounded-lg">
        <h2 class="mt-4 text-xl font-semibold text-white">${destino.nome}</h2>
        <p class="mt-2 text-gray-300">${destino.descricao}</p>
        <button class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg p-2"
          onclick="favoritar('${destino.nome}')">Favoritar</button>
      `;
  
      container.appendChild(card);
    });
  }
  