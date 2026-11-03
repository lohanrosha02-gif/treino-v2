# Meu Treino · Portal do cliente (Supabase)

Este repositório é o **site principal dos alunos**, com o visual completo da versão anterior. O cadastro de clientes, as medições e a gestão de treinos ficam no painel administrativo do repositório [`treino`](https://github.com/lohanrosha02-gif/treino).

## Como funciona

- O aluno cria a própria conta com nome, e-mail e senha e confirma o e-mail. O cadastro só libera acesso depois da aprovação no painel ADM.
- Se a confirmação não chegar, a tela de entrada permite solicitar outro e-mail; os limites temporários do Supabase são mostrados com uma orientação clara.
- A função `register_treino_client()` registra a conta confirmada como pendente, mesmo sem cadastro prévio pelo professor.
- A interface mantém o **layout antigo** e as **8 semanas**, seleção de treinos por dia, vídeos animados com imagens, registro de séries, cargas, repetições e tempos, notas, treino concluído e evolução semanal.
- Continuam funcionando o cronômetro de descanso, tema claro/escuro e backup/exportação/importação de registros.
- A avaliação pessoal original foi restaurada: o aluno pode preencher e atualizar **idade, peso, altura, cintura, abdômen, quadril, busto, tórax, braços, coxa e panturrilha**; o site calcula automaticamente **IMC, cintura/altura e cintura/quadril**, mostra as figuras de faixas de IMC e a tabela de comparação.
- A avaliação pessoal pertence à conta e é salva no `client_progress` com RLS. Em seção separada, o aluno vê as **12 medidas atuais registradas pelo professor no ADM**, apenas para consulta.
- O menu **Vídeos e exercícios** contém os **40 movimentos originais** dos treinos A, B, C e D.
- O histórico de séries é salvo localmente com chave diferente por conta e sincronizado na tabela `client_progress`, protegida por RLS.
- O portal informa quando o progresso foi sincronizado ou continua salvo apenas neste navegador aguardando conexão.
- Se a última alteração ainda não chegou ao Supabase, o portal mantém a cópia local mais recente e tenta sincronizá-la na próxima abertura.
- O aluno **registra sua execução e evolução**, mas não tem permissão para alterar as medidas publicadas nem a estrutura da ficha. O banco usa Row Level Security (RLS), e não apenas o bloqueio visual, para impedir gravação por clientes e leitura de outros clientes.
- O tema claro/escuro, inclusive fundo preto no escuro, segue funcionando. Vídeos anteriores continuam em `assets/videos/` e as mídias são vinculadas por IDs existentes.
- Um aviso publicado no painel administrativo aparece aos clientes aprovados.
- Na aprovação, o painel ADM atribui o plano-base A–D somente a quem ainda não tem plano; treinos personalizados já existentes são preservados.

## Ativar

Projeto conectado ao Supabase. Para preparar uma nova instalação, siga estes passos.

1. Configure o projeto, as três migrações SQL e o usuário administrador seguindo [SUPABASE_SETUP.md no repositório treino](https://github.com/lohanrosha02-gif/treino/blob/main/SUPABASE_SETUP.md).
2. Preencha apenas a **URL do projeto** e a **chave publishable** em `supabase-config.js` nos dois repositórios. Nunca use a `service_role` nem chaves `sb_secret_` em arquivos públicos.
3. Configure as URLs de autenticação/redirecionamento para `https://lohanrosha02-gif.github.io/treino-v2/` (e o admin em `/treino/`).
4. Use GitHub Pages a partir de `main`, pasta `/ (root)` (ou a cópia de `dist/` gerada com o build).

## Privacidade, histórico e migração

- Medidas e planos **por cliente** são persistidos no Supabase com controle por usuário. Não grave informações individuais em arquivos públicos do GitHub.
- O site carrega `app.js`, `treinos.js`, `experience.js` e `legacy-catalog.js` somente após login e aprovação. A ficha individual vem do Supabase; `data/site-content.json` fica apenas como catálogo genérico dos exercícios e das mídias.
- Os dados anteriores de navegador não são copiados automaticamente para nenhuma conta, evitando misturar históricos de alunos. Quem tiver backup anterior pode importá-lo com o menu **Meus dados**.
- Antes de usar dados reais em uma instalação nova, confira as políticas RLS com contas distintas.

## Desenvolvimento

`node --check client-supabase.js` verifica sintaxe de JavaScript. `node scripts/build.mjs` prepara uma cópia estática em `dist/`.
