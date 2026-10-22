import os
import zipfile

applet_dir = '/app/applet'
public_dir = os.path.join(applet_dir, 'public')
os.makedirs(public_dir, exist_ok=True)

source_zip_path = os.path.join(public_dir, 'televideo-pro-source.zip')
dist_zip_path = os.path.join(public_dir, 'televideo-pro-dist.zip')

# 1. Create Source Code ZIP
print("Creating source zip...")
ignored_dirs = {'node_modules', '.git', 'dist', '__pycache__', '.aistudio'}
ignored_extensions = {'.zip', '.log'}

with zipfile.ZipFile(source_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(applet_dir):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith('.')]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ignored_extensions:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, applet_dir)
            # avoid adding the zip itself
            if 'televideo-pro-' in rel_path:
                continue
            zipf.write(full_path, rel_path)

print(f"Source ZIP created: {os.path.getsize(source_zip_path) / (1024*1024):.2f} MB")

# 2. Create Dist ZIP (Pre-built production ready)
dist_dir = os.path.join(applet_dir, 'dist')
print("Creating dist zip...")
with zipfile.ZipFile(dist_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(dist_dir):
        for file in files:
            if file.endswith('.zip'):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, dist_dir)
            zipf.write(full_path, rel_path)

print(f"Dist ZIP created: {os.path.getsize(dist_zip_path) / (1024*1024):.2f} MB")
print("All zip archives ready in public/")
