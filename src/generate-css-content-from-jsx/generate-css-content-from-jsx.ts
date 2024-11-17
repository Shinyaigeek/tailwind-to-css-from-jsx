import { isTSX } from "../jsx/is-tsx/is-tsx.ts";
import { parseJSX } from "../jsx/parser/parse.ts";
import { buildGenerateCSSContentFromTailwindToken } from "../tailwind/build-generate-css-content-from-tailwind-token/build-generate-css-content-from-tailwind-token.ts";
import {
  createErr,
  createOk,
  isErr,
  isOk,
  Result,
  unwrapErr,
  unwrapOk,
} from "npm:option-t/plain_result";
import { walkASTAsync } from "@sxzz/ast-kit";
import {
  ActionForInvalidToken,
  askActionForInvalidToken,
} from "../interaction/ask-action-for-invalid-token/ask-action-for-invalid-token.ts";
import {
  pseudoTailwindTokenMaps,
  splitPseudoTailwindTokens,
} from "../tailwind/split-psedou-tailwind-tokens/split-psedou-tailwind-tokens.ts";
import { filterNonTailwindDesignTokensClearly } from "../tailwind/is-tailwind-class-names-string-literal/filter-non-tailwind-design-tokens-clearly.ts";
import { generateCSSClassNames } from "../tailwind/generate-css-class-names/generate-css-class-names.ts";
import { Node, StringLiteral } from "npm:@babel/types";
import { askClassNameForTargetTailwindTokens } from "../interaction/ask-class-name-for-target-tailwind-tokens/ask-class-name-for-target-tailwind-tokens.ts";

export type TailwindTokensStringLiteralNodeProcessorType = (
  node: StringLiteral,
  parent: Node | null | undefined,
  className: string,
) => Node;

interface Props {
  sourceCode: string;
  sourceFile: string;
  generateCSSContentFromTailwindToken: ReturnType<
    typeof buildGenerateCSSContentFromTailwindToken
  >;
  askActionForInvalidToken: typeof askActionForInvalidToken;
  askClassNameForTargetTailwindTokens:
    typeof askClassNameForTargetTailwindTokens;
  generateCSSClassNames: typeof generateCSSClassNames;
  tailwindTokenStringLiteralNodeProcessor:
    TailwindTokensStringLiteralNodeProcessorType;
}

interface CSSContent {
  content: string;
  jsxAst: Node;
}

export const generateCSSContentFromJSX: (
  props: Props,
) => Promise<Result<CSSContent, Error>> = async function ({
  sourceCode,
  sourceFile,
  generateCSSContentFromTailwindToken,
  generateCSSClassNames,
  tailwindTokenStringLiteralNodeProcessor,
  askClassNameForTargetTailwindTokens,
  askActionForInvalidToken,
}) {
  const astResult = parseJSX(sourceCode, isTSX(sourceFile));
  if (isErr(astResult)) {
    return astResult;
  }

  const ast = unwrapOk(astResult);

  let cssContent = "";
  const walkedAst = await walkASTAsync(ast, {
    enter: async function (allNode, parent) {
      if (allNode.type !== "StringLiteral") {
        return;
      }

      const node = allNode as StringLiteral;

      const tokens = node.value.split(" ").filter((token) => {
        return filterNonTailwindDesignTokensClearly(token);
      });

      if (tokens.length === 0) {
        return;
      }

      const pseudoTokens = splitPseudoTailwindTokens(tokens);

      const className = await askClassNameForTargetTailwindTokens(
        sourceCode,
        sourceFile,
        node,
      ) ?? generateCSSClassNames("TODO");

      for (
        const [pseudoToken, tailwindTokens] of Object.entries(pseudoTokens)
      ) {
        // TODO: more type safely
        // @ts-ignore
        const pseudoSuffix = pseudoTailwindTokenMaps[pseudoToken];
        const cssContentResults = tailwindTokens.map((token) => {
          return generateCSSContentFromTailwindToken(token);
        });

        const cssContentErrors = cssContentResults.filter((result) =>
          isErr(result)
        );

        const todoMarkContents = [];

        if (cssContentErrors.length > 0) {
          for (const cssContentErrorResult of cssContentErrors) {
            const cssContentError = unwrapErr(cssContentErrorResult);

            const action = await askActionForInvalidToken(
              cssContentError.token,
              sourceCode,
              sourceFile,
              node,
            );

            switch (action) {
              case ActionForInvalidToken.Mark: {
                todoMarkContents.push(cssContentError.token);
                break;
              }
              case ActionForInvalidToken.Skip: {
                return;
              }
              case ActionForInvalidToken.Reject: {
                throw new Error("TODO");
              }
            }
          }
        }

        let cssContentInThisBlock = "";

        const cssContentOks = cssContentResults.filter((result) => {
          return isOk(result);
        }).map((result) => {
          return unwrapOk(result);
        });

        cssContentInThisBlock += cssContentOks.join("\n");

        if (todoMarkContents.length > 0 || cssContentInThisBlock.length > 0) {
          cssContent += `.${className}${pseudoSuffix} {\n/** TODO: ${
            todoMarkContents.join(",")
          } */\n${cssContentInThisBlock}\n}\n`;
          this.replace(tailwindTokenStringLiteralNodeProcessor(
            node,
            parent,
            className,
          ));
        }
      }
    },
  });

  if (walkedAst === null) {
    return createErr(new Error("walkedAst is null"));
  }

  return createOk({
    content: cssContent,
    jsxAst: walkedAst,
  });
};
