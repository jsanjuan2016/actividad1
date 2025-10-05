import article from "../src/js/article-element.js";

const articlesLoaderModule = (function () {
    const queryString = window.location.search;
    const marker = window.location.hash;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('page');  

    const POST_PER_PAGE = 5; //Número de posts por página
    const NO_PAGE = page === null; //true si no hay parámetro page en la URL
    const CURRENT_PAGE = !NO_PAGE ? parseInt(page) : 1; //Si no hay página en la URL, por defecto es la 1
    const START_INDEX = (CURRENT_PAGE - 1) * POST_PER_PAGE; //0 para la primera página
    const END_INDEX = START_INDEX + (POST_PER_PAGE);  

    let settings = {
      articleContainer: document.querySelector('#article-container'),
      postList: document.querySelector('#post-list'),
      paginationContainer: document.querySelector('#pagination-container'),
      tocContainer: document.querySelector('#toc-container')
    };
    let operations = {

      loadData: () => {
        // Cargar y procesar el archivo JSON
        fetch("src/data/data.json")
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            let cont = 0;
            operations.createTableOfContents(data);

            const postsToRender = data.slice(START_INDEX, END_INDEX);
            for (const article of postsToRender) { 
              operations.createArticleElement(`${cont}`, article.title, article.date, article.content, article.href);
              operations.createListItem(`${cont}`, article.title);
              cont++;
            }

            operations.renderPaginationControls(data);

            if(marker !== '') {
              document.querySelector(marker).scrollIntoView({
                  behavior: 'smooth'
              }); 
            }
          })
          .catch((error) => {
            let ul = document.querySelector('#post-list');
            const p = document.createElement("p");
            p.appendChild(document.createTextNode(`Error: ${error.message}`));
            console.error(error);
          });          
      },
      createArticleElement: (id, title, date, content, href) => {
        const articleElement = document.createElement('article-element');
        articleElement.setAttribute('id', `blog_entry_${id}`);
        articleElement.setAttribute('idc', `${id}`);
        articleElement.setAttribute('title', title);
        articleElement.setAttribute('date', date);
        articleElement.setAttribute('content', operations.truncate(content, 200));
        articleElement.setAttribute('ref', href);

        settings.articleContainer.appendChild(articleElement);
      },
      createListItem: (id, title)  =>{
        const li = document.createElement("li");
        const a = document.createElement('a');
        a.href = `#blog_entry_${id}`;
        a.textContent = operations.truncate(title, 25);
        li.appendChild(a);

        settings.postList.appendChild(li);
      },
      renderPaginationControls: (data) => {
        const pageCount = Math.ceil(data.length / POST_PER_PAGE);

        for (let i = 1; i <= pageCount; i++) {
            const link = document.createElement('a');
            link.textContent = i;
            link.href = `?page=${i}`; 

            if (i === CURRENT_PAGE) {
                link.classList.add('active');
            } 

            settings.paginationContainer.appendChild(link);            
        }
      },
      createTableOfContents: (data) => {
        let cont = 0;

        let list = settings.tocContainer.querySelector('ul');
        
        for (const article of data) { 
          const li = document.createElement('li');
          const link = document.createElement('a');
          if(CURRENT_PAGE == parseInt(cont / POST_PER_PAGE) + 1)
            link.classList.add('active'); 

          link.href = `?page=${parseInt(cont / POST_PER_PAGE) + 1}#blog_entry_${cont % POST_PER_PAGE}`;
          link.textContent = article.title;

          li.appendChild(link);
          list.appendChild(li);

          cont++;
        }
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

articlesLoaderModule.init();

//export default articlesLoaderModule; //Necesario si queremos importar este módulo en otro lado. En este caso no es necesario, ya que es el mismo módulo el que llama a init y el módulo no expone ningún otro método.