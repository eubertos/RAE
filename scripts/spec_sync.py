#!/usr/bin/env python3
import os, json
SRC = 'the-loop/specs/ui-colors.md'
DST = 'the-loop/vars/design-tokens.json'
APP_DST = 'app/design-tokens.json'

def parse_table(md_text):
    lines = [l for l in md_text.splitlines() if l.strip().startswith('|')]
    if not lines:
        return {}
    headers = [h.strip() for h in lines[0].strip('|').split('|')]
    result = {}
    for row in lines[2:]:
        cells = [c.strip() for c in row.strip('|').split('|')]
        token_id = cells[0]
        result[token_id] = {headers[i]: cells[i] for i in range(1, len(headers))}
    return result

def main():
    if not os.path.exists(SRC):
        print(f"{SRC} not found."); exit(1)
    with open(SRC) as f:
        tokens = parse_table(f.read())
    out = {}
    for k, v in tokens.items():
        kmain = k.split('.')
        d = out
        for part in kmain[:-1]:
            d = d.setdefault(part, {})
        d[kmain[-1]] = v['default']
    for path in (DST, APP_DST):
        with open(path, 'w') as f:
            json.dump(out, f, indent=2)
        print(f"Wrote {path}")

if __name__ == '__main__':
    main()
