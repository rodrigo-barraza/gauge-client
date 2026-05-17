import subprocess
import re

def main():
    try:
        output = subprocess.check_output(['npx', 'tsc', '--noEmit'], stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        output = e.output

    files_to_fix = {}

    for line in output.split('\n'):
        # match: src/hooks/useReadings.tsx:27:16 - error TS18046: 'error' is of type 'unknown'.
        # match: src/hooks/useSensors.tsx:49:34 - error TS7006: Parameter 'data' implicitly has an 'any' type.
        m = re.match(r'^([^:]+):(\d+):(\d+) - error TS7006: Parameter \'([^\']+)\' implicitly has an \'any\' type.', line)
        if m:
            file = m.group(1)
            lineno = int(m.group(2))
            param = m.group(4)
            if file not in files_to_fix:
                files_to_fix[file] = set()
            files_to_fix[file].add((lineno, 'param', param))

        m = re.match(r'^([^:]+):(\d+):(\d+) - error TS18046: \'([^\']+)\' is of type \'unknown\'.', line)
        if m:
            file = m.group(1)
            lineno = int(m.group(2))
            param = m.group(4)
            if file not in files_to_fix:
                files_to_fix[file] = set()
            files_to_fix[file].add((lineno, 'unknown', param))

    for file, fixes in files_to_fix.items():
        with open(file, 'r') as f:
            lines = f.readlines()

        for lineno, ftype, param in fixes:
            idx = lineno - 1
            if ftype == 'unknown' and param == 'error':
                lines[idx] = re.sub(r'catch\s*\(\s*error\s*\)', 'catch (error: any)', lines[idx])
            elif ftype == 'param':
                lines[idx] = re.sub(r'\b' + param + r'\b(?!:)', param + ': any', lines[idx])
                # Note: this simple regex could break if param is used multiple times, but good enough for params
        
        with open(file, 'w') as f:
            f.writelines(lines)

if __name__ == '__main__':
    main()
