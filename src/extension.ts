import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  RevealOutputChannelOn,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  const config = vscode.workspace.getConfiguration("alphabet");
  const lspEnabled = config.get<boolean>("lsp.enabled", true);

  if (!lspEnabled) {
    return;
  }

  const binaryPath = config.get<string>("lsp.path", "alphabet");

  const serverOptions: ServerOptions = {
    command: binaryPath,
    args: ["--lsp"],
    transport: TransportKind.stdio,
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
