# Meu Treino · v2

Site estático de acompanhamento de oito semanas, com avaliação inicial independente, treinos A–D, registro de cada série e cronômetro de descanso.

## O que mudou

- Interface responsiva em branco, verde e sálvia, com sessões e semanas mais claras.
- Progresso por exercício, semana e plano completo (32 sessões).
- Cargas e repetições independentes por série, com histórico da semana anterior.
- Cronômetro de descanso com pausa, reinício, acréscimo de tempo e som opcional.
- Exportação e restauração de backup JSON.
- Vídeos anatômicos com fundo branco, corpo cinza e músculos em laranja, proporção 16:9, resolução 960 × 540, 24 fps, silenciosos em loop.
- Carregamento ao abrir o exercício, pausa fora da tela e ao trocar de aba. Respeita a preferência por redução de movimento.

Os dados continuam na mesma chave `meu-treino-v2` do navegador. Os caminhos `/treino/` e `/treino-v2/`, publicados no mesmo domínio GitHub Pages, compartilham esse armazenamento. Os dados não são enviados a um servidor e não são sincronizados entre aparelhos. Um aparelho novo começa sem medidas preenchidas.

## Publicar no GitHub Pages

No repositório, abra **Settings → Pages** e selecione **Deploy from a branch → main → / (root) → Save**. Não há instalação nem compilação obrigatória. O site original no repositório `treino` não foi alterado.

## Vídeos específicos pendentes

Há **30 atividades com vídeo anatômico**, reutilizando 21 arquivos. As 11 atividades abaixo mantêm o passo a passo, sem mostrar animação de outro estilo nem associar um movimento diferente:

| Atividade | IDs |
| --- | --- |
| Rotação torácica / de tronco sentado | mA2, mC1, mD2 |
| Deslizamento de braços na parede | mA3, mC2 |
| Quadríceps isométrico no leg press | b7 |
| Glúteos isométricos unilaterais sentado | b9 |
| Extensão de joelho com caneleira e isometria | b10 |
| Contração isométrica de glúteos sentado | d4 |
| Mobilização ativa confortável do joelho | d5 |
| Alongamento de posterior de coxa em pé | mB5 |

A biblioteca consultada não forneceu clipes anatômicos correspondentes a esses movimentos. O vídeo anterior de mB5 mostrava um alongamento deitado. O vídeo da rosca unilateral foi corrigido para `cable-one-arm-curl` e a orientação da polia da remada posterior foi alinhada à demonstração.

Para adicionar um vídeo: coloque o MP4 e o pôster WebP em `assets/videos/`, atualize a entrada correspondente em `videos.js` e remova `status: "pending"`. Preserve exercício, equipamento e tipo de contração da ficha.

## Desenvolvimento

Arquivos principais: `index.html`, `app.css`, `app.js`, `treinos.css`, `treinos.js`, `videos.js` e `experience.js`.

Verificação de sintaxe:

```sh
node --check app.js
node --check treinos.js
node --check experience.js
node --check videos.js
```

`node scripts/build.mjs` prepara uma cópia em `dist/` para prévia. Para publicar diretamente no GitHub Pages, use os arquivos da raiz.

Fontes e créditos dos vídeos em [FONTES_VIDEOS.md](FONTES_VIDEOS.md).
