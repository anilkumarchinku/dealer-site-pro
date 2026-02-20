"""
remove_bg.py
Removes white/near-white backgrounds from logo PNGs and saves them
as transparent PNGs in-place.

Method: flood-fill from all four corners with a tolerance of 30 (0-255).
Only processes files whose corners are detected as white/near-white.
"""

import os
from PIL import Image
import numpy as np

LOGO_DIR = os.path.dirname(os.path.abspath(__file__))
TOLERANCE = 30   # how far from pure white a pixel can be and still be removed

def is_white_corner(arr: np.ndarray, threshold: int = 230) -> bool:
    """Return True if all 4 corners are near-white (R,G,B >= threshold)."""
    corners = [arr[0, 0], arr[0, -1], arr[-1, 0], arr[-1, -1]]
    for c in corners:
        r, g, b = int(c[0]), int(c[1]), int(c[2])
        if r < threshold or g < threshold or b < threshold:
            return False
    return True

def flood_fill_transparent(img: Image.Image, tolerance: int) -> Image.Image:
    """
    Flood-fill from all 4 corners.
    Any pixel within `tolerance` of pure white (255,255,255) that is
    reachable from a corner without crossing a non-white region is made
    fully transparent.
    """
    img = img.convert("RGBA")
    data = np.array(img, dtype=np.float32)
    h, w = data.shape[:2]

    # Build mask: True where pixel is "white enough"
    white_mask = (
        (data[:, :, 0] >= 255 - tolerance) &
        (data[:, :, 1] >= 255 - tolerance) &
        (data[:, :, 2] >= 255 - tolerance)
    )

    # BFS from corners
    from collections import deque
    visited = np.zeros((h, w), dtype=bool)
    queue = deque()

    for sy, sx in [(0, 0), (0, w-1), (h-1, 0), (h-1, w-1)]:
        if white_mask[sy, sx] and not visited[sy, sx]:
            queue.append((sy, sx))
            visited[sy, sx] = True

    while queue:
        y, x = queue.popleft()
        for dy, dx in [(-1,0),(1,0),(0,-1),(0,1)]:
            ny, nx = y+dy, x+dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and white_mask[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

    # Apply: set alpha=0 for all visited (background) pixels
    result = data.copy()
    result[visited, 3] = 0

    return Image.fromarray(result.astype(np.uint8), "RGBA")

def process_logos():
    files = sorted(f for f in os.listdir(LOGO_DIR) if f.endswith('.png'))
    processed, skipped = [], []

    for fname in files:
        path = os.path.join(LOGO_DIR, fname)
        try:
            img = Image.open(path).convert("RGBA")
            arr = np.array(img)

            # Skip if corners already transparent
            corners = [arr[0,0], arr[0,-1], arr[-1,0], arr[-1,-1]]
            if any(c[3] < 10 for c in corners):
                skipped.append(f"  already transparent: {fname}")
                continue

            # Skip if corners are not white
            if not is_white_corner(arr):
                skipped.append(f"  non-white background, skipping: {fname}")
                continue

            result = flood_fill_transparent(img, TOLERANCE)
            result.save(path)
            processed.append(f"  ✓ {fname}")

        except Exception as e:
            skipped.append(f"  ERROR {fname}: {e}")

    print("=== Processed (white bg removed) ===")
    for s in processed: print(s)
    print(f"\n=== Skipped ({len(skipped)}) ===")
    for s in skipped: print(s)
    print(f"\nDone. {len(processed)} logos updated.")

if __name__ == "__main__":
    process_logos()
