import { buildGenerateCSSContentFromTailwindToken } from "./build-generate-css-content-from-tailwind-token.ts";
import { assertEquals } from "jsr:@std/assert";
import { isOk } from "option-t/plain_result";
import { createAssertSnapshot } from "jsr:@std/testing/snapshot";
import { stripAnsiCode } from "@std/fmt/colors";
import { unwrapOk } from "option-t/plain_result";

const assertSnapshot = createAssertSnapshot({
  dir: ".snaps",
});

const assertMonochromeSnapshot = createAssertSnapshot<string>(
  { serializer: stripAnsiCode },
  assertSnapshot,
);

Deno.test({
  name:
    "generated function should return CSS content from valid Tailwind token",
  fn: async (t) => {
    const generateCSSContentFromTailwindToken =
      buildGenerateCSSContentFromTailwindToken();

    const validTailwindTokens = [
      "bg-blue-500",
      "text-red-500",
      "p-4",
      "m-4",
      "rounded-lg",
      "shadow-lg",
      "hover:bg-blue-700",
      "focus:outline-none",
      "focus:ring-2",
      //  TODO: We need to re-implement CSS Content generator from scratch to support latest TailwindCSS features
      //   "focus:ring-blue-500",
      //   "focus:ring-opacity-50",
      "sm:text-center",
      "w-1/2",
      "w-[12px]",
    ];

    for (const validTailwindToken of validTailwindTokens) {
      const result = generateCSSContentFromTailwindToken(validTailwindToken);
      assertEquals(isOk(result), true);

      await assertMonochromeSnapshot(t, unwrapOk(result));
    }
  },
});
