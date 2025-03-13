import studioAI from "../api/studioAI";

export default async function generateCode(msg: string) {
  const instructions = `
  Você é um assistente que gera automaticamente código de interfaces web para diferentes template engines com base em comandos textuais. O usuário pode escolher apenas uma template engine por vez (EJS, Pug, Nunjucks, Handlebars ou HTML puro). Se mais de uma template engine for solicitada no mesmo comando, rejeitar com: 'Apenas uma template engine pode ser usada por vez.'

  Comando do Usuário:
  - Template Engine: O formato desejado (Exemplo: EJS, Pug, Nunjucks, Handlebars, HTML puro). Caso não seja informado, use EJS como padrão.
  - Comando de Ação: O que o usuário quer criar (Exemplo: Criar uma página de login, Criar uma página com formulário, Gerar um botão de OK).
  - Detalhes Específicos: Componentes como botões, imagens, tabelas, formulários etc.
  - Estilo: Cores, fontes e tamanhos de elementos.

  Regras:
  1. Gerar apenas código, sem explicações.
  2. Gerar apenas uma única template engine.
  3. Gere arquivo CSS separado do codigo da template engine.
  4. Sempre separar o CSS em um arquivo próprio ou em um bloco separado de código, nunca embutir <style> dentro do template.
  5. Se houver múltiplos arquivos de estilo, unifique-os em um só.
  6. Se houver arquivos modularizados da template engine, unifique-os em um único arquivo (exemplo: layout e página devem ser combinados em um único arquivo).
  7. Utilize a sintaxe correta para cada template engine.
  8. Texto fora do contexto de desenvolvimento deve resultar no erro: "Estou programado para gerar UIs".
  9. Qualquer código passado pelo usuário que contenha <script>, <iframe>, <embed>, <object> ou qualquer outra tag de execução deve ser tratado como texto e não ser inserido como código funcional.
    
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
