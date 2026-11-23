# Code & Coffee

Loja virtual de uma cafeteria, feita em Angular 19 com autenticação, banco de dados e Edge Function no Supabase.

## Contexto

Projeto final da disciplina Frameworks Web 2 do curso de Análise e Desenvolvimento de Sistemas do Senac (Porto Alegre), desenvolvido individualmente em 2025.

## Funcionalidades

- Cadastro e login de clientes pelo Supabase Auth (com confirmação por e-mail), com validação dos campos no formulário: nome completo, formato de e-mail, senha mínima e confirmação de senha.
- Loja com os produtos lidos da tabela `products` e carrossel de destaques na página inicial (Swiper).
- Busca de produtos por nome ou descrição, implementada com um pipe próprio (`searchFilter`).
- Pedidos: ao adicionar um produto, o sistema reaproveita o pedido "Aguardando confirmação" do cliente ou cria um novo, atualizando o total.
- "Meus pedidos" separado por situação (em andamento, entregues, cancelados), com confirmar, marcar como entregue, cancelar e excluir.
- "Minha conta": alteração de nome, e-mail e senha, e exclusão da conta.
- Rotas protegidas por guards: `authGuard` para as páginas do cliente (guardando a rota pedida em `returnUrl` para voltar a ela depois do login) e `guestGuard` para impedir que quem já está logado abra login e cadastro.
- Páginas institucionais (Sobre nós, Nosso café) e layout responsivo com Bootstrap.

## Stack

- Angular 19 (componentes standalone, Router, FormsModule) e TypeScript 5.7
- Supabase: Auth, banco Postgres (`products` e `orders`) e uma Edge Function em Deno
- Bootstrap 5.3, Bootstrap Icons e Swiper 11
- Karma e Jasmine (testes gerados pelo Angular CLI)
- Deploy na Vercel (`vercel.json` com rewrite para o roteamento do SPA)

## Como rodar

Pré-requisitos: Node.js e Angular CLI.

```bash
npm install
npm start        # ng serve, em http://localhost:4200
npm run build    # build de produção em dist/
npm test         # ng test (Karma)
```

A URL e a chave pública (anon) do projeto Supabase ficam em `src/environments/environment.ts` e `environment.prod.ts`. Para usar outro projeto Supabase, troque esses dois valores e crie as tabelas `products` e `orders` com os campos dos modelos em `src/app/models`.

A Edge Function `delete-user-account` precisa das variáveis `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SERVICE_ROLE_KEY` configuradas no Supabase.

## Estrutura

```
src/app/
  components/   cabeçalho, rodapé e carrossel de produtos
  pages/        home, loja, busca, login, cadastro, meus pedidos, minha conta, institucionais
  services/     auth, produtos, pedidos e cliente Supabase
  guards/       authGuard e guestGuard
  pipes/        filtro de busca
  models/       Product, Order e User
supabase/functions/delete-user-account/   Edge Function de exclusão de conta
```

## Destaques técnicos

- A exclusão de conta roda numa Edge Function: ela confere o usuário pelo token da requisição e só então usa a chave de serviço (que nunca vai para o navegador) para apagar os pedidos e o usuário.
- Toda a comunicação com o Supabase fica isolada em serviços, e as páginas só chamam métodos como `addProductToOrder` ou `getOrdersFromAuthenticatedUser`.
- Guards funcionais do Angular combinados com `returnUrl`, para o cliente voltar à página que tentou abrir antes do login.
- O projeto começou com `json-server` como API simulada e depois migrou para o Supabase (Auth, banco e Edge Function).
