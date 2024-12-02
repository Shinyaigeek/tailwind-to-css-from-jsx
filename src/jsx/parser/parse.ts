import { babelParse } from "@sxzz/ast-kit";
import { createErr, createOk, Result } from "option-t/plain_result";

export const parseJSX: (
  code: string,
  isTSX: boolean,
) => Result<ReturnType<typeof babelParse>, Error> = function (code, isTSX) {
  try {
    return createOk(babelParse(code, isTSX ? "tsx" : "jsx"));
  } catch (e) {
    return createErr(
      new Error("Can't parse passed file", {
        cause: e,
      }),
    );
  }
};
