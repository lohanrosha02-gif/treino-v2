# Meu Treino · v2

Site estático de acompanhamento de oito semanas, com avaliação inicial independente, treinos A–D, registro de cada série e cronômetro de descanso.

## O que mudou

- Interface responsiva em branco, verde e sálvia, com sessões e semanas mais claras.
- Progresso por exercício, semana e plano completo (32 sessões).
- Cargas e repetições independentes por série, com histórico da semana anterior.
- Cronômetro de descanso com pausa, reinício, acréscimo de tempo e som opcional.
- Exportação e restauração de backup JSON.
- Vídeos anatômicos com fundo branco, corpo cinza e músculos em laranja, proporção 16:9, resolução 960 × 540, 24 fps, silenciosos em loop.
- As 16 ilustrações anatômicas realistas agora têm animação leve de respiração em loops de 4 segundos, identificados como referências animadas.
- Carregamento ao abrir o exercício, pausa fora da tela e ao trocar de aba. Respeita a preferência por redução de movimento.

Os dados continuam na mesma chave `meu-treino-v2` do navegador. Os caminhos `/treino/` e `/treino-v2/`, publicados no mesmo domínio GitHub Pages, compartilham esse armazenamento. Os dados não são enviados a um servidor e não são sincronizados entre aparelhos. Um aparelho novo começa sem medidas preenchidas.

## Publicar no GitHub Pages

No repositório, abra **Settings → Pages** e selecione **Deploy from a branch → main → / (root) → Save**. Não há instalação nem compilação obrigatória. O site original no repositório `treino` não foi alterado.

## Atualização dos treinos C e D

- **C:** copiado integralmente da versão 1 atual: três mobilidades em quatro apoios, supino inclinado, remada, peck deck, puxada alta, tríceps, prancha 3 × 40 s e bicicleta leve de 8–12 minutos.
- **D:** mobilidades de joelhos/posterior/bola, stiff com barra livre 3 × 10, sentar-levantar 3 × 10, abdutora 2 × 12, panturrilha 2 × 15, prancha 3 × 40 s e caminhada em esteira com 15 minutos de inclinação individualizada.
- As referências anatômicas realistas usam vídeos em `assets/videos/animated-*.mp4` e pôsteres em `assets/images/`. São ilustrações animadas de referência.
- A prancha permite registrar **segundos por série** sem coluna de carga. Registros antigos ficam guardados, mas uma ficha modificada precisa ser concluída novamente.
- Cuidado: com dor crônica nos joelhos, a inclinação da esteira e a amplitude de agachamento devem ser ajustadas ou suspensas caso provoquem sintomas.

## Demonstrações completas

Todas as **40 atividades** têm mídia em vídeo: **23 com demonstrações de exercícios** e **17 com ilustrações animadas**, derivadas das **16 imagens originais**. Não há atividades sem mídia nem avisos de demonstração pendente.

As imagens foram criadas com `image_gen.imagegen`, seguindo as referências visuais fornecidas, e otimizadas para WebP. Os prompts estão em [docs/illustration-prompts.json](docs/illustration-prompts.json). As animações mantêm a posição ilustrativa com respiração sutil; não mostram um ciclo completo do exercício. O passo a passo e a ficha continuam visíveis abaixo da mídia.

As animações têm o mesmo formato dos demais vídeos locais: 16:9, 960 × 540, 24 fps, H.264, sem áudio e com início rápido. As especificações de cada imagem e o procedimento de reprodução estão em [docs/ANIMACOES.md](docs/ANIMACOES.md).

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
