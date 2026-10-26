# Fontes dos vídeos do Meu Treino v2

## Biblioteca anatômica

- Origem das referências já usadas no site original: https://github.com/buzops9/exercisedb
- Catálogo consultado: `data/exercises.json` (317 exercícios).
- URLs originais de cada vídeo preservadas no campo `source` de `videos.js`.
- Os vídeos anatômicos são utilizados em 23 atividades da ficha atual. Personagem anatômico cinza, músculos destacados em laranja e fundo branco.
- Cópias locais normalizadas com FFmpeg para 960 × 540, 24 fps, H.264, `yuv420p`, sem áudio e com `faststart`. Pôsteres WebP locais.
- Não foram usadas imagens estáticas como se fossem vídeos de execução.

## Correspondência com a ficha

- As animações locais antigas com manequim de outro estilo foram removidas da v2.
- Todas as atividades têm mídia: os movimentos sem vídeo anatômico específico usam imagens originais realistas identificadas como ilustrações.
- A rosca unilateral na polia usa `cable-one-arm-curl`, em vez de uma rosca bilateral com os braços elevados.
- O alongamento posterior em pé agora usa uma imagem própria, sem associar a demonstração deitada à ficha em pé.

## Imagens originais

- 16 imagens criadas com a ferramenta integrada `image_gen.imagegen`, aplicadas em 17 atividades, inclusive mobilidades, isometrias, prancha e movimentos adaptados.
- Estilo baseado nas duas referências do usuário: anatomia em cinza, destaques laranja, fundo branco e acabamento realista.
- Arquivos WebP em `assets/images/`; prompts completos em `docs/illustration-prompts.json`.
- As imagens são posições de referência, não gravações humanas ou animações de execução. O site identifica o tipo de mídia corretamente.

## Licença do projeto da biblioteca

O README da biblioteca distingue a licença de seu código e metadados da procedência dos vídeos. Os créditos e informações do fornecedor devem ser consultados na fonte acima.

```text
MIT License

Copyright (c) 2026 Arham Wani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

