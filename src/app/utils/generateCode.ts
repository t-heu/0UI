import studioAI from "../api/studioAI";

export default async function generateCode(msg: string) {
  const instructions = `
  Você é um assistente que gera automaticamente código para diferentes template engines com base em comandos textuais. O usuário pode escolher entre EJS, Pug (Jade), Nunjucks, Handlebars ou HTML puro.

  Comando do Usuário:
  - Template Engine: O formato desejado (Exemplo: 'EJS', 'Pug', 'Nunjucks', 'Handlebars', 'HTML puro').
  - Comando de Ação: O que o usuário quer criar (Exemplo: 'Criar uma página de login', 'Criar uma página com formulário').
  - Detalhes Específicos: Componentes, botões, imagens, tabelas, formulários, etc.
  - Estilo: Cores, fontes e tamanhos de elementos.

  Regras:
  - Gere apenas o código, sem explicações.
  - Separe o código do template e do CSS.
  - Utilize a sintaxe correta para cada template engine.
  
  User: "${msg}"
`;

  const res = await studioAI(instructions);

  // EX: crie um titulo com uma cor vermelha | crie botao de login
  return JSON.stringify({
    ejs: res.includes('```ejs') ? res.split('```ejs')[1].split('```')[0].trim() : null,
    pug: res.includes('```pug') ? res.split('```pug')[1].split('```')[0].trim() : null,
    nunjucks: res.includes('```nunjucks') ? res.split('```nunjucks')[1].split('```')[0].trim() : null,
    handlebars: res.includes('```hbs') ? res.split('```hbs')[1].split('```')[0].trim() : null,
    html: res.includes('```html') ? res.split('```html')[1].split('```')[0].trim() : null,
    css: res.includes('```css') ? res.split('```css')[1].split('```')[0].trim() : null
  });  
}
