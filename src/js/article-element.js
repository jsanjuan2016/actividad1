export default class BlogPost extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); // Crea una raíz de Shadow DOM para encapsular el componente.
  }

  connectedCallback() { // Se llama cuando el componente es añadido al DOM.
    this.render();
  }
  
  static get observedAttributes() { // Lista los atributos que el componente observará.
    //return ['id', 'idc', 'title', 'date', 'content', 'ispost', 'ref'];
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue, href) { // Se llama cuando un atributo observado cambia.
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    // Obtiene los valores de los atributos o usa valores predeterminados.
    const id = this.getAttribute('id') || 'Sin id';
    const idc = this.getAttribute('idc') || '';
    const page = this.getAttribute('page') || 1;
    const title = this.getAttribute('title') || 'Sin título';
    const date = this.getAttribute('date') || 'Sin fecha';
    const content = this.getAttribute('content') || 'Sin contenido';
    const ispost = this.getAttribute('ispost') || 'false';
    const ref = this.getAttribute('ref') || '';
    const fullRef = ref === '' || ref === "undefined" ? `` : `<span class="reference">Ref.: <a href="${ref}" target="_blank">[Art&iacute;culo original] ${title}</a></span>`;
    const postRef = idc === '' || ref === "undefined" ? `` : `post.html?idc=${idc}&page=${page}`;
    const continueReading = idc === '' || ref === "undefined" ? `` : `[<a href="${postRef}">Seguir leyendo</a>]`;
    

    // Define la estructura HTML del componente dentro del Shadow DOM.
    this.shadowRoot.innerHTML = `
      <style>
        article {
          font-family: Arial, sans-serif;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          background-color: #f9f9f9;
        }
        h3 {
          color: #333;
          margin-top: 0;
        }
        .post-date {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 10px;
          display: block;
        }
        .post-content {
          color: #555;
          line-height: 1.6;
        }
        .reference {
          display: block;
          margin-top: 5px;
          margin-bottom: 5px;
          font-size: 0.9em;
          font-style: italic;
        }
        .reference a {  
          color: #0155c4ff;
          text-decoration: none;
        }
        .reference a:visited {  
          color: #a600acff;
          text-decoration: none;
        }          
      </style>

      <article id="${id}">
        <h3><a href="${postRef}">${title}</a></h3>
        <span class="post-date">${date}</span>
        <p class="post-content">${content} ${continueReading}</p>
        ${fullRef}
        `
        + (ispost === 'true' ? '<a href="index.html">Volver al inicio</a>' : '<a href="#post-list">Arriba</a>') +
        ` 
      </article>
    `;
  }
}

// Define el nuevo elemento personalizado.
if(customElements.get('article-element') === undefined) { //Evitamos excepción interna si el elemento ya está previamente definido
  customElements.define('article-element', BlogPost);
}
// else
// 	console.log('custom element is defined');
