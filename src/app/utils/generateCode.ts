import studioAI from "../api/studioAI";

export default async function generateCode(msg: string) {
  const instructions = `
    Você é um assistente que cria automaticamente páginas web usando EJS a partir de comandos textuais. Quando um usuário me fornecer um comando, eu irei gerar o código correspondente com base nas instruções fornecidas. O comando sempre estará estruturado de acordo com este formato:
    Comando do Usuário:
    Comando de Ação: O que o usuário quer criar (Exemplo: 'Criar uma página de login', 'Criar uma landing page simples', 'Criar uma página com formulário de contato').
    Detalhes Específicos: Descrição dos componentes, como botões, imagens, tabelas, formulários, etc., se houver necessidade (Exemplo: 'Adicionar um formulário com campos Nome, Email, Mensagem', 'Adicionar um botão azul', 'Adicionar uma tabela com três colunas').
    Estilo: Descrição dos estilos específicos, como cores, fontes e tamanhos de elementos (Exemplo: 'Botão azul com texto branco', 'Fonte Arial', 'Cor de fundo branca').
    Com essas informações, eu irei gerar o código EJS correspondente, com todas as variáveis e componentes definidos pelo usuário.

    Responda apenas com codigo, nada mais.
    Não inclua explicações, saudações ou frases adicionais
    Separe css e o ejs

    User: "${msg}"
  `;

  const res = await studioAI(instructions);

  // Suponha que o retorno da AI seja um texto que contenha EJS e CSS separados
  // Vamos assumir que o AI retorna algo que pode ser parseado em JSON
  // EX: crie um titulo com uma cor vermelha
  return JSON.stringify({
    ejs: res.split('```ejs')[1].split('```')[0].trim(), // Pega a parte do EJS entre as crases
    css: res.split('```css')[1].split('```')[0].trim()  // Pega a parte do CSS entre as crases
  });
}
