import * as net from "net";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  RevealOutputChannelOn,
  StreamInfo,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

const LSP_PORT = 7777;

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  const config = vscode.workspace.getConfiguration("alphabet");
  const lspEnabled = config.get<boolean>("lsp.enabled", true);

  if (!lspEnabled) {
    return;
  }

  const binaryPath = config.get<string>("lsp.path", "alphabet");

  const serverOptions: ServerOptions = () => {
    return new Promise<StreamInfo>((resolve, reject) => {
      const server = require("child_process").spawn(binaryPath, ["--lsp"], {
        shell: false,
      });

      server.stderr.on("data", (data: Buffer) => {
        console.error(`Alphabet LSP stderr: ${data.toString()}`);
      });

      setTimeout(() => {
        const socket = net.createConnection({ port: LSP_PORT }, () => {
          resolve({ reader: socket, writer: socket });
        });

        socket.on("error", (err) => {
          reject(err);
        });
      }, 500);
    });
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "alphabet" }],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher("**/*.abc"),
    },
    outputChannelName: "Alphabet Language Server",
    revealOutputChannelOn: RevealOutputChannelOn.Error,
    traceOutputChannel: vscode.window.createOutputChannel("Alphabet LSP Trace"),
  };

  client = new LanguageClient(
    "alphabet",
    "Alphabet Language Server",
    serverOptions,
    clientOptions,
  );

  try {
    await client.start();
  } catch (err) {
    vscode.window.showErrorMessage(
      `Alphabet LSP failed to start. Ensure the 'alphabet' binary is on your PATH. Error: ${err}`,
    );
  }

  context.subscriptions.push({
    dispose: () => stopClient(),
  });
}

export async function deactivate(): Promise<void> {
  await stopClient();
}

async function stopClient(): Promise<void> {
  if (client) {
    await client.stop();
    client = undefined;
  }
}
