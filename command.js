const vscode = require("vscode");

const runFile = function (terminal, document) {
  const path = document.fileName.replace(`${vscode.workspace.rootPath}/`, "");
  const command = `mix test ${path}`;
  terminal.sendText(command);
}

const runDescribe = function (terminal, index, document) {
  const line = document.lineAt(index);
  const describeRegex = /\s*describe\s+.(.*).\s+do/;
  const path = document.fileName.replace(`${vscode.workspace.rootPath}/`, "");
  const testName = line.text.match(describeRegex)[1];
  const testRegex = testName.replace(/[^a-zA-Z]/g, ".");
  const command = `mix test ${path} --name /${testRegex}/`;
  terminal.sendText(command);
}

const runTest = function (terminal, index, document) {
  const path = document.fileName.replace(`${vscode.workspace.rootPath}/`, "");
  const command = `mix test ${path}:${index + 1}`;
  terminal.sendText(command);
}

const command = function (type, index, document) {
  const elixirTestsTerminal =
    vscode.window.terminals.find((terminal) => { return terminal.name === "Elixir Tests"; }) ||
    vscode.window.createTerminal("Elixir Tests");

  elixirTestsTerminal.show();
  elixirTestsTerminal.sendText("clear");
  if (type === "file") {
    runFile(elixirTestsTerminal, document);
  }
  if (type === "describe") {
    runDescribe(elixirTestsTerminal, index, document);
  }
  if (type === "it" || type === "test") {
    runTest(elixirTestsTerminal, index, document);
  }
};

module.exports = { runFile, runDescribe, runTest, command };
