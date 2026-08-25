import os
import glob
from PIL import Image, ImageOps

def compress_image(filepath, max_dim=1600, quality=82):
    orig_size = os.path.getsize(filepath)
    try:
        with Image.open(filepath) as img:
            # Auto-orient EXIF camera photos
            img = ImageOps.exif_transpose(img)

            # Convert RGBA/P to RGB for JPEG format if needed
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            width, height = img.size
            if width > max_dim or height > max_dim:
                if width > height:
                    new_width = max_dim
                    new_height = int(height * (max_dim / width))
                else:
                    new_height = max_dim
                    new_width = int(width * (max_dim / height))
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Save optimized JPEG over original file
            img.save(filepath, "JPEG", quality=quality, optimize=True, progressive=True)

        new_size = os.path.getsize(filepath)
        saved = orig_size - new_size
        print(f"Compressed {os.path.basename(filepath)}: {orig_size / 1024 / 1024:.2f} MB -> {new_size / 1024 / 1024:.2f} MB ({saved / orig_size * 100:.1f}% reduced)")
        return orig_size, new_size
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return orig_size, orig_size

def main():
    dirs = [
        "d:/Webpage/public/photos/gallery",
        "d:/Webpage/public/photos/hero-collision",
    ]
    
    total_orig = 0
    total_new = 0

    for d in dirs:
        pattern = os.path.join(d, "*.*")
        for f in glob.glob(pattern):
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                o, n = compress_image(f)
                total_orig += o
                total_new += n

    print(f"\n==========================================")
    print(f"TOTAL BEFORE: {total_orig / 1024 / 1024:.2f} MB")
    print(f"TOTAL AFTER:  {total_new / 1024 / 1024:.2f} MB")
    print(f"TOTAL SAVED:  {(total_orig - total_new) / 1024 / 1024:.2f} MB ({((total_orig - total_new) / total_orig) * 100:.1f}%)")
    print(f"==========================================")

if __name__ == "__main__":
    main()
