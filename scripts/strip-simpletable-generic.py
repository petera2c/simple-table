#!/usr/bin/env python3
"""Strip SimpleTable<T> type args from a React demo; drop unused type imports."""
from __future__ import annotations

import re
import sys
from pathlib import Path


def strip_file(path: Path) -> bool:
    text = path.read_text()
    types = set(re.findall(r"SimpleTable<([A-Za-z0-9_]+)>", text))
    if not types:
        return False

    out = re.sub(r"SimpleTable<([A-Za-z0-9_]+)>", "SimpleTable", text)

    for t in types:
        # Mentions outside import lines?
        non_import = []
        for line in out.splitlines():
            if re.match(r"^\s*import\b", line):
                continue
            if re.search(rf"\b{t}\b", line):
                non_import.append(line)
        if non_import:
            continue

        # Remove from import clauses
        out = re.sub(rf",\s*type {t}\b", "", out)
        out = re.sub(rf"type {t}\s*,\s*", "", out)
        out = re.sub(rf"\btype {t}\b", "", out)
        # import type { Foo } from "..."  (only that name)
        out = re.sub(
            rf'import type \{{\s*{t}\s*\}}\s*from\s*["\'][^"\']+["\'];\s*\n',
            "",
            out,
        )
        # import type { Foo, Bar } already handled by type Foo removal
        out = re.sub(r"import type \{\s*\}\s*from\s*[\"'][^\"']+[\"'];\s*\n", "", out)

    # Tidy multiline imports that only have one named binding left
    def tidy_import(m: re.Match[str]) -> str:
        body = m.group(1)
        names = [n.strip() for n in body.split(",") if n.strip()]
        if not names:
            return ""
        if len(names) == 1 and "\n" in body:
            return f"import {{ {names[0]} }} from {m.group(2)};\n"
        return m.group(0)

    out = re.sub(
        r"import \{\n((?:.*\n)*?)\} from ([\"'][^\"']+[\"']);\n",
        tidy_import,
        out,
    )
    # Remove trailing commas before }
    out = re.sub(r",(\s*)\}", r"\1}", out)
    # Collapse empty lines introduced (max 2)
    out = re.sub(r"\n{3,}", "\n\n", out)

    if out != text:
        path.write_text(out)
        return True
    return False


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: strip-simpletable-generic.py <Demo.tsx>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    changed = strip_file(path)
    print("changed" if changed else "unchanged", path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
