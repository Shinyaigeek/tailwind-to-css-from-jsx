import { assertEquals } from "jsr:@std/assert";
import { createAssertSnapshot } from "jsr:@std/testing/snapshot";
import { stripAnsiCode } from "jsr:@std/fmt/colors";
import { parseJSX } from "./parse.ts";
import { isOk, unwrapOk } from "option-t/plain_result";

const assertSnapshot = createAssertSnapshot({
  dir: ".snaps",
});

const assertMonochromeSnapshot = createAssertSnapshot<string>(
  { serializer: stripAnsiCode },
  assertSnapshot,
);

Deno.test({
  name: "parse should return an AST on JSX",
  fn: async function (t) {
    const code = `function Test() {
            return <div></div>
        }`;
    const res = parseJSX(code, false);

    assertEquals(isOk(res), true);
    await assertMonochromeSnapshot(t, JSON.stringify(unwrapOk(res)));
  },
});

Deno.test({
  name: "parse should return an AST on TSX",
  fn: async function (t) {
    const code = `function Test(hello: string) {
            return <div>{hello}</div>
        }`;
    const res = parseJSX(code, true);

    assertEquals(isOk(res), true);
    await assertMonochromeSnapshot(t, JSON.stringify(unwrapOk(res)));
  },
});

Deno.test({
  name: "parse should return an error on invalid code",
  fn: function () {
    const code = `function Test(hello: string) {
            return <div>{hello}</div>
        `;
    const res = parseJSX(code, true);

    assertEquals(isOk(res), false);
  },
});
