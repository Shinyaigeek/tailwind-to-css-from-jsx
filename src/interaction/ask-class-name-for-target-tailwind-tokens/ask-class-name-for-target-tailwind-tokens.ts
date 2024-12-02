import { StringLiteral } from "@babel/types";

export const askClassNameForTargetTailwindTokens: (
  sourceFileText: string,
  sourceFilePath: string,
  node: StringLiteral,
) => Promise<string | null> = async function (
  sourceFileText,
  sourceFilePath,
  node,
) {
  const targetLine = (node.loc?.start.line ?? 0) - 1;

  const sourceFileTextSplitted = sourceFileText.split("\n");

  console.info(
    `%c"${node.value}" seems to be a Tailwind token.`,
    "color: green",
  );

  console.log("----source code----");

  console.log(`${targetLine - 2}:${sourceFileTextSplitted[targetLine - 2]}`);
  console.log(`${targetLine - 1}:${sourceFileTextSplitted[targetLine - 1]}`);
  console.log(`${targetLine}:${sourceFileTextSplitted[targetLine]}`);
  console.log(`${targetLine + 1}:${sourceFileTextSplitted[targetLine + 1]}`);
  console.log(`${targetLine + 2}:${sourceFileTextSplitted[targetLine + 2]}`);

  console.log("----source file----");
  console.log(`${sourceFilePath}:${targetLine + 1}:${node.loc?.start.column}`);
  console.log("-------------------");

  const gotClassName = await prompt(
    `What is the class name for "${node.value}"?`,
  );

  if (gotClassName === null || gotClassName === "") {
    return null;
  }

  return gotClassName;
};
