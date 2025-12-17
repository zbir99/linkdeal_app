import os
import re

def clean_merge_conflicts(file_path):
    """Remove merge conflict markers, keeping HEAD (ours) version."""
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Check if file has conflicts
    if '<<<<<<<' not in content:
        return False
    
    # Pattern to match merge conflict blocks
    # Keeps content between <<<<<<< HEAD and =======
    pattern = r'<<<<<<<[^\n]*\n(.*?)=======\n.*?>>>>>>>[^\n]*\n'
    
    def replace_conflict(match):
        return match.group(1)
    
    cleaned = re.sub(pattern, replace_conflict, content, flags=re.DOTALL)
    
    # Also handle nested conflicts (<<<<<<< HEAD inside <<<<<<< HEAD)
    while '<<<<<<<' in cleaned:
        cleaned = re.sub(pattern, replace_conflict, cleaned, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(cleaned)
    
    return True

def main():
    src_dir = r'c:\Users\pc\Desktop\linkdeal_app\linkdeal_app\frontend\src'
    fixed_count = 0
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                file_path = os.path.join(root, file)
                if clean_merge_conflicts(file_path):
                    print(f'Fixed: {file}')
                    fixed_count += 1
    
    print(f'\nTotal files fixed: {fixed_count}')

if __name__ == '__main__':
    main()
