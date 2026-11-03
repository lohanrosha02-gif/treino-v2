# Meu Treino · Portal do cliente (Supabase)

Este repositório é o **site principal, somente para consulta**. O cadastro de clientes, as medições e a gestão de treinos ficam no painel administrativo do repositório [`treino`](https://github.com/lohanrosha02-gif/treino).

## Como funciona

- O aluno cria a própria conta com nome, e-mail e senha e confirma o e-mail. O cadastro só libera acesso depois da aprovação no painel ADM.
- A função `register_treino_client()` registra a conta confirmada como pendente, mesmo sem cadastro prévio pelo professor.
- A tela mostra **somente as próprias** 12 medições corporais e as sessões personalizadas, com imagens de prévia e vídeos dos exercícios.
- A aba **Todos os exercícios + vídeos** restaura os treinos originais **A, B, C e D**, com **40 demonstrações**, imagens e orientações. Esse acervo é referência, não substitui a prescrição individual.
- Nenhum cliente tem botão para alterar medidas ou treinos. O banco usa Row Level Security (RLS), e não apenas o bloqueio visual, para impedir gravação por clientes e leitura de outros clientes.
- O tema claro/escuro, inclusive fundo preto no escuro, segue funcionando. Vídeos anteriores continuam em `assets/videos/` e as mídias são vinculadas por IDs existentes.
- Um aviso publicado no painel administrativo aparece aos clientes aprovados.
- Na aprovação, o painel ADM atribui o plano-base A–D somente a quem ainda não tem plano; treinos personalizados já existentes são preservados.

## Ativar

O Supabase ainda precisa ser configurado antes de receber dados reais.

1. Configure o projeto, a migração SQL e o usuário administrador seguindo [SUPABASE_SETUP.md no repositório treino](https://github.com/lohanrosha02-gif/treino/blob/main/SUPABASE_SETUP.md).
2. Preencha apenas a **URL do projeto** e a **chave publishable** em `supabase-config.js` nos dois repositórios. Nunca use a `service_role` nem chaves `sb_secret_` em arquivos públicos.
3. Configure as URLs de autenticação/redirecionamento para `https://lohanrosha02-gif.github.io/treino-v2/` (e o admin em `/treino/`).
4. Use GitHub Pages a partir de `main`, pasta `/ (root)` (ou a cópia de `dist/` gerada com o build).

## Privacidade, histórico e migração

- Medidas e planos **por cliente** são persistidos no Supabase com controle por usuário. Não grave informações individuais em arquivos públicos do GitHub.
- Os arquivos antigos `app.js`, `treinos.js`, `content.js` e `data/site-content.json` foram mantidos para consulta e compatibilidade histórica, **mas não são carregados pela página principal**.
- Dados anteriores em `localStorage` não são apagados, porém **não são migrados automaticamente** para o Supabase.
- Não habilite o uso com dados reais antes de executar e testar a migração RLS com contas distintas.

## Desenvolvimento

`node --check client-supabase.js` verifica sintaxe de JavaScript. `node scripts/build.mjs` prepara uma cópia estática em `dist/`.
