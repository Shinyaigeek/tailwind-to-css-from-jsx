import { filterNonTailwindDesignTokensClearly } from "./filter-non-tailwind-design-tokens-clearly.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test({
  name: "with empty string",
  fn: function () {
    assertEquals(filterNonTailwindDesignTokensClearly(""), false);
  },
});

Deno.test({
  name: "with valid tailwind token which only contains alphabets",
  fn: function () {
    assertEquals(filterNonTailwindDesignTokensClearly("flex"), true);
  },
});

Deno.test({
  name: "with valid tailwind token which contains alphabets & hyphen",
  fn: function () {
    assertEquals(filterNonTailwindDesignTokensClearly("w-auto"), true);
  },
});

Deno.test({
  name: "with valid tailwind token which contains alphabets & numeric",
  fn: function () {
    assertEquals(filterNonTailwindDesignTokensClearly("w-4"), true);
  },
});

Deno.test({
  name: "with valid tailwind token which contains dynamic token",
  fn: function () {
    assertEquals(filterNonTailwindDesignTokensClearly("w-[48px]"), true);
  },
});

Deno.test({
  name: "with invalid tailwind token",
  fn: function () {
    assertEquals(filterNonTailwindDesignTokensClearly("テスト"), false);
  },
});
