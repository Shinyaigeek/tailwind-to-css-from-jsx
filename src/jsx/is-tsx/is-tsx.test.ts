import { isTSX } from "./is-tsx.ts";
import { assertEquals } from "jsr:@std/assert";

Deno.test({
  name: "isTSX should return true for .tsx files",
  fn: function () {
    const filename = "test/test.tsx";
    assertEquals(isTSX(filename), true);
  },
});

Deno.test({
  name: "isTSX should return false for .ts files",
  fn: function () {
    const filename = "test/test.ts";
    assertEquals(isTSX(filename), false);
  },
});

Deno.test({
  name: "isTSX should return false for .js files",
  fn: function () {
    const filename = "test/test.js";
    assertEquals(isTSX(filename), false);
  },
});

Deno.test({
  name: "isTSX should return false for .jsx files",
  fn: function () {
    const filename = "test/test.jsx";
    assertEquals(isTSX(filename), false);
  },
});
