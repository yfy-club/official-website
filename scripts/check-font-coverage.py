from pathlib import Path

from fontTools.ttLib import TTFont


glyph_file = Path("scripts/heading-glyphs.txt")
font_files = [
    Path("public/fonts/NotoSerifSC-Heading-subset.woff2"),
    Path("public/fonts/NotoSerifSC-Heading-subset.ttf"),
    Path("public/fonts/NotoSerifSC-Heading-subset.woff"),
]

glyphs = set(glyph_file.read_text(encoding="utf-8").rstrip("\r\n"))
for font_file in font_files:
    if not font_file.exists():
        raise SystemExit(f"Missing {font_file}; run npm run fonts:subset")

    font = TTFont(font_file)
    cmap = font.getBestCmap() or {}
    missing = sorted(character for character in glyphs if ord(character) not in cmap)

    if missing:
        raise SystemExit(f"{font_file} is missing {len(missing)} glyphs: {''.join(missing)}")

woff2_size = font_files[0].stat().st_size
if woff2_size >= 40 * 1024:
    raise SystemExit(f"Heading subset is {woff2_size} bytes; M4 budget is below 40960 bytes")

print(f"Heading fonts cover {len(glyphs)} glyphs (web WOFF2: {woff2_size} bytes).")
