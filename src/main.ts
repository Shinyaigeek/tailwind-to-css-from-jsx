import { parseArgs } from "@std/cli";
import { loadTailwindConfig } from "./tailwind/load-tailwind-config/load-tailwind-config.ts";
import { isOk, unwrapErr, unwrapOk } from "option-t/plain_result";
import { buildGenerateCSSContentFromTailwindToken } from "./tailwind/build-generate-css-content-from-tailwind-token/build-generate-css-content-from-tailwind-token.ts";
import { generateCSSContentFromJSX } from "./generate-css-content-from-jsx/generate-css-content-from-jsx.ts";
import { generateCSSClassNames } from "./tailwind/generate-css-class-names/generate-css-class-names.ts";
import { askActionForInvalidToken } from "./interaction/ask-action-for-invalid-token/ask-action-for-invalid-token.ts";
import { convertTailwindTokenStringLiteralNodeToCSSModulesStyle } from "./css-modules/convert-tailwind-token-string-literal-node-to-css-modules-style/convert-tailwind-token-string-literal-node-to-css-modules-style.ts";
import generate from "@babel/generator";
import { join } from "@std/path";
import { askClassNameForTargetTailwindTokens } from "./interaction/ask-class-name-for-target-tailwind-tokens/ask-class-name-for-target-tailwind-tokens.ts";
import { Config } from "tailwindcss";

const targetFile = Deno.args[0];

if (!targetFile) {
  console.error("%cPlease provide a target file", "color: red");
  Deno.exit(1);
}

const flags = parseArgs(Deno.args.slice(1), {
  string: ["config"],
});

let tailwindConfig: Config | undefined = undefined;

if (flags.config) {
  const tailwindConfigResult = await loadTailwindConfig(flags.config);

  if (isOk(tailwindConfigResult)) {
    tailwindConfig = unwrapOk(tailwindConfigResult);
  } else {
    throw unwrapErr(tailwindConfigResult);
  }
}

const generateCSSContentFromTailwindToken =
  buildGenerateCSSContentFromTailwindToken(tailwindConfig);

const sourceFileText = await Deno.readTextFile(targetFile);
const sourceFile = join(Deno.cwd(), targetFile);

const cssContentResult = await generateCSSContentFromJSX({
  sourceCode: sourceFileText,
  sourceFile,
  generateCSSContentFromTailwindToken,
  generateCSSClassNames,
  askActionForInvalidToken,
  askClassNameForTargetTailwindTokens,
  tailwindTokenStringLiteralNodeProcessor:
    convertTailwindTokenStringLiteralNodeToCSSModulesStyle,
});

const cssContent = unwrapOk(cssContentResult);

if (cssContent.content.length > 1) {
  Deno.writeTextFile(
    sourceFile.replace(".tsx", ".module.css"),
    cssContent.content,
  );
  const jsx = generate.default(cssContent.jsxAst);
  Deno.writeTextFile(sourceFile, jsx.code);
}
