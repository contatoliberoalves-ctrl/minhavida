# Handoff: Colocar "Minha Vida" no ar (computador + celular)

## Visão geral
"Minha Vida" é um painel pessoal (agenda, projetos, alunos, conteúdo, lançamentos, finanças, metas, aperfeiçoamento pessoal) construído em HTML + React (via `<script type="text/babel">`, sem build step). Hoje ele roda **inteiramente no navegador**: não há servidor, banco de dados ou login real — os dados ficam salvos em `localStorage` do navegador que abrir o arquivo, e os dois perfis (Líbero Filho / Ana Cecília) são só uma troca de tela, sem senha.

## Importante: isto é um protótipo funcional, não um produto pronto para múltiplos usuários
Os arquivos aqui são **referências de design totalmente interativas** — a tela, o fluxo e os dados de exemplo já refletem o produto final desejado. Mas como tudo vive em `localStorage`:
- Cada navegador/aparelho tem sua **própria cópia dos dados** — o que Líbero preenche no computador não aparece no celular da Ana Cecília, e vice-versa.
- Não existe autenticação real (qualquer pessoa com o link pode clicar em qualquer perfil).
- As integrações (Google Agenda/Gmail/Drive/Docs, Meet, Trello, Cartório) são **simuladas na interface**, com avisos de "requer conexão real" — a UI já está pronta, mas as chamadas de API de verdade ainda precisam ser implementadas.

A tarefa do Claude Code é: (1) colocar o app no ar rapidamente do jeito que está (para uso já, aceitando as limitações acima), e (2) se o usuário quiser dados compartilhados entre dispositivos e login de verdade, evoluir para um backend simples.

## Passo a passo — colocar no ar HOJE (rápido, sem backend)
O app é 100% estático (HTML/CSS/JS), então qualquer hospedagem de site estático funciona e já fica acessível por computador e celular (é só abrir a URL).

1. Use os arquivos desta pasta (`Minha Vida.html` + pasta `app/`) como raiz do site.
2. Suba num host estático gratuito, por exemplo:
   - **Vercel**: `npx vercel` na pasta (ou conectar o repositório no dashboard).
   - **Netlify**: arrastar a pasta em app.netlify.com/drop, ou `netlify deploy`.
   - **GitHub Pages**: subir para um repositório e ativar Pages na branch principal.
3. Renomeie `Minha Vida.html` para `index.html` (ou configure o host para servir esse arquivo como página inicial).
4. Confirme que a pasta `app/` (JS, CSS, seeds) foi enviada junto, com os mesmos caminhos relativos usados no HTML (`app/styles.css`, `app/app.jsx` etc.).
5. Acesse a URL gerada pelo host no computador e no celular — funciona nos dois porque é só uma página web responsiva (não precisa instalar nada).
6. (Opcional, recomendado) Ative HTTPS automático do host e, se quiser um domínio próprio (ex.: `minhavida.libero.com`), aponte o DNS para o host.
7. (Opcional) Para parecer mais um app no celular: no Safari/Chrome, usar "Adicionar à tela de início" — isso já funciona sem nenhuma mudança no código, pois o HTML tem viewport responsivo.

Isso resolve "colocar no ar" — mas lembrando: cada aparelho terá seus próprios dados locais até o passo de backend abaixo ser feito.

## Passo a passo — evoluir para dados compartilhados e login real (recomendado para uso por duas pessoas em aparelhos diferentes)
1. Criar um backend simples (ex.: Node/Express, ou uma BaaS como Supabase/Firebase) com:
   - Tabela/coleção para cada entidade hoje em `localStorage`: `commitments`, `tx`, `students`, `launches`, `content`, `bills`, `goals`, `practices`, `practiceLogs`, `readings`, `emails`, `expenseTags`, `incomeTags`, `collabs`, `cards`, `tithes`, `settings`, `playbookChecks`, `playbookExtra`, `customSections`.
   - Autenticação real com 2 contas (Líbero e Ana Cecília), cada uma com as permissões de tela já definidas em `app/app.jsx` (`PROFILES.libero.access = 'all'`, `PROFILES.ana.access = [...]`).
2. Substituir o `StoreProvider` (`app/store.jsx`) — hoje ele lê/escreve só em `localStorage` — por chamadas à API do backend (mesmo formato de dados, então a troca é direta).
3. Implementar as integrações reais quando desejado: Google Calendar/Gmail/Drive/Docs (OAuth), Google Meet (criação de link via API), Trello (API key + token), e o site do cartório (`cartoriocurralqueimado.netlify.app`) via API própria ou scraping autorizado.
4. Repetir o deploy estático (frontend) + hospedar o backend novo (Render, Railway, Fly.io, Vercel Functions, etc.), then apontar o frontend para a API.

## Estrutura dos arquivos
- `Minha Vida.html` — shell principal, carrega React/Babel via CDN e todos os scripts abaixo em ordem.
- `app/styles.css` — sistema visual (cor verde oliva `#6e8b3d`, Poppins, tokens de espaçamento/sombra).
- `app/seed.js` — dados iniciais (projetos, tags, colaboradores, compromissos do calendário 2026, playbook de lançamento importado do Trello).
- `app/util.js` — helpers de data/moeda.
- `app/store.jsx` — estado global (React Context) + persistência em `localStorage`. **É aqui que entra a troca por chamadas de API real.**
- `app/ui.jsx`, `app/forms.jsx` — componentes e formulários compartilhados (ícones, modais, cards, anexos).
- `app/view_*.jsx` — uma view por aba do menu (agenda, projetos, alunos, finanças, cartório, etc.).
- `app/app.jsx` — shell do app: tela de login de perfil, menu lateral filtrado por perfil, roteamento por hash (`#agenda`, `#financas`...).
- `app/launch_playbook.js` — dados do checklist de lançamento importados do Trello.

## Perfis e permissões (já implementado no frontend)
- **Líbero Filho**: acesso a todas as abas.
- **Ana Cecília**: acesso só a Compromissos, Projetos, Aperfeiçoamento, Metas, Finanças e Integrações (ver `PROFILES` em `app/app.jsx`). Isso é apenas uma restrição de **interface** — sem backend/autenticação real, não é uma barreira de segurança de verdade.
