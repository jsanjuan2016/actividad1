import article from "https://jsanjuan2016.github.io/actividad1/src/js/article-element.js";

const articleLoaderModule = (function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('idc');

    let settings = {
      articleContainer: document.querySelector('#article-container'),
      postList: document.querySelector('#post-list'),
      paginationContainer: document.querySelector('#pagination-container'),
      tocContainer: document.querySelector('#toc-container')
    };
    let operations = {
      loadData: () => {
        fetch("src/data/data.json")
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            const postsToRender = data.slice(id, parseInt(id) + 1);
            for (const article of postsToRender) { 
              operations.createArticleElement(`${id}`, article.title, article.date, article.content, article.href); 
            }
          })
          .catch((error) => {
            const p = document.createElement("p");
            p.appendChild(document.createTextNode(`Error: ${error.message}`));
            console.error(error);
          });         
      },
      createArticleElement: (id, title, date, content, href) => {
          const articleElement = document.createElement('article-element');
          articleElement.setAttribute('id', `blog_entry_${id}`);
          articleElement.setAttribute('title', title);
          articleElement.setAttribute('date', date);
          articleElement.setAttribute('content', content);
          articleElement.setAttribute('ref', href);
          articleElement.setAttribute('ispost', true);
          settings.articleContainer.appendChild(articleElement);
      },
      truncate: (input, length) => input.length > (length || 5) ? `${input.substring(0, length)}...` : input
    };

    let init = function() {
      operations.loadData(); 
    };

    return {
        init
    };
})();

articleLoaderModule.init();












/*
// Obtener el parámetro 'page' de la URL para la paginación de artículos
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('idc');

document.querySelector('#article-container').innerHTML = ''; //Limpiar el contenedor de artículos
  // Cargar y procesar el archivo JSON
  fetch("src/data/data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const postsToRender = data.slice(id, parseInt(id) + 1);
      for (const article of postsToRender) { 
        createArticleElement(`${id}`, article.title, article.date, article.content, article.href);
      }
    })
    .catch((error) => {
      const p = document.createElement("p");
      p.appendChild(document.createTextNode(`Error: ${error.message}`));
      console.error(error);
    });

  const createArticleElement = (id, title, date, content, href) => {
    const articleElement = document.createElement('article-element');
    articleElement.setAttribute('id', `blog_entry_${id}`); 
    articleElement.setAttribute('title', title);
    articleElement.setAttribute('date', date);
    articleElement.setAttribute('content', content);
    articleElement.setAttribute('ref', href);
    articleElement.setAttribute('ispost', true);
    document.querySelector('#article-container').appendChild(articleElement);
  }
  const truncate = (input, length) => input.length > (length || 5) ? `${input.substring(0, length)}...` : input;  
  */