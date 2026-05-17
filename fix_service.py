import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix catch (error) -> catch (error: any)
    content = re.sub(r'catch\s*\(\s*error\s*\)', 'catch (error: any)', content)
    # Fix function parameters like (data) -> (data: any)
    content = re.sub(r'async function\s+\w+\s*\(([^)]+)\)', lambda m: 'async function ' + re.match(r'async function\s+(\w+)', m.group(0)).group(1) + '(' + ', '.join([p + ': any' if ':' not in p and '=' not in p else p for p in m.group(1).split(', ')]) + ')', content)

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('/home/rodrigo/development/gauge-client/src/services/GaugeService.ts')
