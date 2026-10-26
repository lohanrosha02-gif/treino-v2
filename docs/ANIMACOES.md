# Ilustrações anatômicas animadas

As 16 imagens originais foram convertidas em loops de referência usados nas 17 atividades que antes tinham imagens. As outras 23 atividades mantêm seus vídeos anatômicos de exercícios.

Cada loop tem 4 segundos, 96 quadros, proporção 16:9, 960 × 540 pixels, 24 fps, H.264 com `yuv420p`, sem áudio e com `faststart`. O pôster é a imagem WebP original. O carregamento, a reprodução automática e a pausa seguem os controles existentes do site e respeitam a preferência por redução de movimento.

A respiração é sugerida por uma deformação suave e localizada em pequenas regiões do tronco, escolhidas para cada figura. A câmera e os apoios permanecem fixos. São posições ilustrativas animadas, sem simular o ciclo completo dos exercícios. Por isso o site exibe **Ilustração animada · referência** junto aos controles.

## Gerar novamente

O site publicado continua estático e não depende de Python. Apenas a geração dos MP4 usa Python com NumPy, SciPy e Pillow, além do executável FFmpeg:

```sh
python -m pip install -r scripts/requirements-animation.txt
python scripts/animate_images.py
```

Para gerar uma imagem específica:

```sh
python scripts/animate_images.py forearm-plank
```

As regiões e amplitudes estão em `docs/animation-spec.json`. Os relatórios e quadros para revisão são gravados em `dist/animation-review/`, que não é versionado. Os arquivos finais são escritos em `assets/videos/animated-*.mp4`.
