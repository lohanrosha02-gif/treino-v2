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

## Atualização dos treinos C e D

- **C:** três mobilidades em quatro apoios, quatro movimentos de peito/costas, tríceps e prancha 3 × 40 s.
- **D:** mobilidades de joelhos/posterior/bola, stiff com barra livre 3 × 10, sentar-levantar 3 × 10, abdutora 2 × 12, panturrilha 2 × 15, prancha 3 × 40 s e caminhada em esteira com 15 minutos de inclinação individualizada.
- Novos arquivos em `assets/videos/`, com versões em vídeo 3D ilustrativo. Não são gravações reais de pessoas e não substituem avaliação do movimento.
- A prancha permite registrar **segundos por série** sem coluna de carga. Registros antigos ficam guardados, mas uma ficha modificada precisa ser concluída novamente.
- Cuidado: com dor crônica nos joelhos, a inclinação da esteira e a amplitude de agachamento devem ser ajustadas ou suspensas caso provoquem sintomas.

## Vídeos ainda pendentes

Algumas demonstrações fora dos treinos C e D ainda carecem de correspondência anatômica específica (`mA2`, `mA3`, `b7`, `b9`, `b10`, `mB5`). Não se devem vincular vídeos de exercícios diferentes apenas para preencher esses espaços.

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
