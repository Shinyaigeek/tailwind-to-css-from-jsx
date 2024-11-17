import { StringLiteral } from "npm:@babel/types";

export enum ActionForInvalidToken {
  Skip = "Skip",
  Mark = "Mark",
  Reject = "Reject",
}

// TODO: We should inject prompt function for testing
export const askActionForInvalidToken: (
  token: string,
  sourceFileText: string,
  node: StringLiteral,
) => Promise<ActionForInvalidToken> = async function (
  token,
  sourceFileText,
  node,
) {
  const targetLine = (node.loc?.start.line ?? 0) - 1;

  const sourceFileTextSplitted = sourceFileText.split("\n");

  console.info(
    `%c"${token}" seems to be an invalid Tailwind token.`,
    "color: green",
  );

  console.log("----source code----");

  console.log(`${targetLine - 2}:${sourceFileTextSplitted[targetLine - 2]}`);
  console.log(`${targetLine - 1}:${sourceFileTextSplitted[targetLine - 1]}`);
  console.log(`${targetLine}:${sourceFileTextSplitted[targetLine]}`);
  console.log(`${targetLine + 1}:${sourceFileTextSplitted[targetLine + 1]}`);
  console.log(`${targetLine + 2}:${sourceFileTextSplitted[targetLine + 2]}`);

  console.log("-------------------");

  let action = "";

  while (action !== "s" && action !== "m" && action !== "r") {
    const gotAction = await prompt(
      `Which action do you want to take for "${token}"?
    - s(kip): Skip this entire string literal
    - m(ark): Mark this invalid token in generated CSS and continues the process
    - r(eject): Reject this entire file
    `,
    );

    if (gotAction === null) {
      throw new Error("User canceled");
    }
    if (gotAction !== "s" && gotAction !== "m" && gotAction !== "r") {
      console.error("Invalid action");
    }

    action = gotAction;
  }

  switch (action) {
    case "s":
      return ActionForInvalidToken.Skip;
    case "m":
      return ActionForInvalidToken.Mark;
    case "r":
      return ActionForInvalidToken.Reject;
  }
};
