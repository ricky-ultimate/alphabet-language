# Alphabet Language Support for VS Code

Provides language support for the [Alphabet programming language](https://github.com/fraol163/alphabet) v2.3.5.

## Features

- Syntax highlighting for `.abc` files
- Snippets for common patterns
- LSP integration (hover, completion, go-to-definition)
- Bracket matching and auto-close
- F-string interpolation highlighting

## Requirements

The `alphabet` binary must be installed and available on your PATH.

Install it:

```bash
curl -fsSL https://raw.githubusercontent.com/fraol163/alphabet/main/install.sh | sh
```

## Configuration

| Setting                | Default      | Description                 |
| ---------------------- | ------------ | --------------------------- |
| `alphabet.lsp.enabled` | `true`       | Enable the language server  |
| `alphabet.lsp.path`    | `"alphabet"` | Path to the Alphabet binary |
| `alphabet.lsp.trace`   | `"off"`      | LSP trace level             |

## Snippets

| Prefix   | Description       |
| -------- | ----------------- |
| `abc`    | File header       |
| `zo`     | Print output      |
| `vi`     | Integer variable  |
| `vs`     | String variable   |
| `vf`     | Float variable    |
| `vl`     | List variable     |
| `vm`     | Map variable      |
| `if`     | If statement      |
| `ife`    | If/else statement |
| `lw`     | While loop        |
| `lf`     | For loop          |
| `class`  | Class definition  |
| `method` | Public method     |
| `try`    | Try/handle block  |
| `match`  | Pattern match     |
| `new`    | New object        |
| `fs`     | F-string          |

## License

MIT
