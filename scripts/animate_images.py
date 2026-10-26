"""Render the reference illustrations as restrained four-second breathing loops.

Requires Pillow, NumPy, SciPy and FFmpeg. These are raster image animations,
not recorded exercise footage or demonstrations of a full movement cycle.
Only the configured torso regions move; camera and supports remain fixed.
"""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import tempfile

import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates

ROOT = Path(__file__).resolve().parents[1]


def render(spec, item):
    width, height = spec['resolution']
    fps = spec['fps']
    duration = spec['durationSeconds']
    source_path = ROOT / item['source']
    target = ROOT / item['output']
    target.parent.mkdir(parents=True, exist_ok=True)
    source = Image.open(source_path).convert('RGB')
    base = np.asarray(source.resize((width, height), Image.Resampling.LANCZOS)).copy()

    cores = item['cores']
    x0 = max(0, int(min(c[0]-c[2] for c in cores)*width)-2)
    x1 = min(width, int(max(c[0]+c[2] for c in cores)*width)+3)
    y0 = max(0, int(min(c[1]-c[3] for c in cores)*height)-2)
    y1 = min(height, int(max(c[1]+c[3] for c in cores)*height)+3)
    region = base[y0:y1, x0:x1].copy()
    gy, gx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    disp_x = np.zeros_like(gx)
    disp_y = np.zeros_like(gy)
    ref_width, ref_height = spec['amplitudeReferenceSize']
    for cx, cy, rx, ry, amplitude_x, amplitude_y in cores:
        nx, ny = (gx/width-cx)/rx, (gy/height-cy)/ry
        support = np.clip(1-nx*nx-ny*ny, 0, 1)**3
        disp_x += nx*support*amplitude_x*width/ref_width
        disp_y += ny*support*amplitude_y*height/ref_height
    local_x, local_y = gx-x0, gy-y0

    # Keep review frames outside the repository's published asset directory.
    review = ROOT / 'dist' / 'animation-review'
    review.mkdir(parents=True, exist_ok=True)
    frame_count = round(fps*duration)
    temporary_directory = tempfile.TemporaryDirectory(prefix='treino-animation-')
    temporary = Path(temporary_directory.name)/(item['name']+'.mp4')
    command = [
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
        '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{width}x{height}',
        '-r', str(fps), '-i', 'pipe:0', '-an',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-threads', '2',
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
        '-metadata', 'title=Ilustracao anatomica animada - referencia',
        '-metadata', 'comment=Subtle breathing animation of original raster artwork; not a full exercise movement cycle.',
        str(temporary),
    ]
    encoder = subprocess.Popen(command, stdin=subprocess.PIPE)
    changed_pixels = 0
    try:
        for frame_index in range(frame_count):
            t = frame_index/fps
            breath = float(0.5-0.5*np.cos(2*np.pi*t/duration))
            frame = base.copy()
            if breath > 0:
                coordinates = [local_y-breath*disp_y, local_x-breath*disp_x]
                warped = np.stack([
                    map_coordinates(region[:, :, channel], coordinates, order=1, mode='nearest')
                    for channel in range(3)
                ], axis=-1)
                frame[y0:y1, x0:x1] = warped
            if frame_index == 0:
                Image.fromarray(frame).save(review/(item['name']+'-start.jpg'), quality=94)
            if frame_index == frame_count//2:
                changed = np.any(frame != base, axis=2)
                changed_pixels = int(changed.sum())
                assert changed_pixels > 100, item['name']+' has no visible animated region'
                assert not np.any(changed[:y0]) and not np.any(changed[y1:]), item['name']
                assert not np.any(changed[:, :x0]) and not np.any(changed[:, x1:]), item['name']
                Image.fromarray(frame).save(review/(item['name']+'-peak.jpg'), quality=94)
            encoder.stdin.write(frame.tobytes())
    finally:
        encoder.stdin.close()
    if encoder.wait() != 0:
        temporary_directory.cleanup()
        raise RuntimeError('Video encoding failed: '+item['name'])
    target.write_bytes(temporary.read_bytes())
    temporary_directory.cleanup()
    return {
        'name': item['name'], 'source': item['source'], 'video': item['output'],
        'durationSeconds': duration, 'fps': fps, 'resolution': [width, height],
        'frames': frame_count, 'bytes': target.stat().st_size,
        'sourceSha256': hashlib.sha256(source_path.read_bytes()).hexdigest(),
        'videoSha256': hashlib.sha256(target.read_bytes()).hexdigest(),
        'changedPixelsAtPeak': changed_pixels,
        'maxDisplacementPixels': [float(np.max(np.abs(disp_x))), float(np.max(np.abs(disp_y)))],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('names', nargs='*', help='Optional illustration names to render.')
    args = parser.parse_args()
    spec = json.loads((ROOT/'docs/animation-spec.json').read_text())
    selected = [a for a in spec['assets'] if not args.names or a['name'] in args.names]
    if args.names and {a['name'] for a in selected} != set(args.names):
        parser.error('Unknown illustration name.')
    results = []
    for item in selected:
        result = render(spec, item)
        results.append(result)
        print(json.dumps({'rendered': item['name'], 'bytes': result['bytes'], 'progress': str(len(results))+'/'+str(len(selected))}), flush=True)
    (ROOT/'dist/animation-review/render-report.json').write_text(json.dumps(results, indent=2))
    print(json.dumps({'complete': len(results), 'bytes': sum(r['bytes'] for r in results)}), flush=True)


if __name__ == '__main__':
    main()
