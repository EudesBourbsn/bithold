#!/usr/bin/env python3
"""Compile the bundle without embedding the build machine's absolute path."""

import os
from pathlib import Path
import sys


def main():
    compiler = Path(os.environ['BITHOLD_HERMES_COMPILER']).resolve(strict=True)
    arguments = sys.argv[1:]
    if '-emit-binary' not in arguments:
        os.execv(str(compiler), [str(compiler), *arguments])
    if '-out' not in arguments:
        raise ValueError('Expected a Hermes bundle compilation with an output file')
    source = Path(arguments[-1]).resolve(strict=True)
    output_index = arguments.index('-out') + 1
    arguments[output_index] = str(Path(arguments[output_index]).resolve())
    arguments[-1] = source.name
    os.chdir(source.parent)
    os.execv(str(compiler), [str(compiler), *arguments])


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, KeyError, IndexError) as error:
        print(f'Hermes compilation: {error}', file=sys.stderr)
        sys.exit(1)
