import { tailwindToCSS, twi as plainTwi } from "tw-to-css";
import type { Config } from "tailwindcss";
import { createErr, createOk, Result } from "option-t/plain_result";

export class UnexpectedTailwindTokenError extends Error {
  constructor(public token: string) {
    super(`Unexpected Tailwind token: ${token}`);
  }
}

export const buildGenerateCSSContentFromTailwindToken: (
  tailwindConfig?: Config,
) => (twToken: string) => Result<string, UnexpectedTailwindTokenError> =
  function (tailwindConfig) {
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
            new UnexpectedTailwindTokenError(twToken),
          );
        }
        return createOk(generatedCSS);
      } catch (e) {
        return createErr(
          new UnexpectedTailwindTokenError(
            twToken,
          ),
        );
      }
    };
  };
