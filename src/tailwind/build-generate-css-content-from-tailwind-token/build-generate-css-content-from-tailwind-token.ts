import { tailwindToCSS, twi as plainTwi } from "npm:tw-to-css";
import type { Config } from "npm:tailwindcss";
import { createErr, createOk, Result } from "npm:option-t/plain_result";

export const buildGenerateCSSContentFromTailwindToken: (
  tailwindConfig?: Config,
) => (twToken: string) => Result<string, Error> = function (tailwindConfig) {
  const twi = (() => {
    if (tailwindConfig) {
      return tailwindToCSS({ config: tailwindConfig }).twi;
    } else {
      return plainTwi;
    }
  })();

  return function (twToken) {
    try {
      const generatedCSS = twi(twToken, {
        ignoreMediaQueries: false,
        minify: false,
      });
      if (generatedCSS === "") {
        return createErr(
          new Error(`Failed to generate CSS from Tailwind token ${twToken}`),
        );
      }
      return createOk(generatedCSS);
    } catch (e) {
      return createErr(
        new Error(
          `Failed to generate CSS from Tailwind token ${twToken}: ${e}`,
        ),
      );
    }
  };
};
