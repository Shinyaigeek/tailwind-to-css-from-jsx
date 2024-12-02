import { createErr, createOk, Result } from "option-t/plain_result";
import type { Config } from "tailwindcss";
import { join } from "@std/path";

export const loadTailwindConfig: (p: string) => Promise<Result<Config, Error>> =
  async function (p) {
    const absPath = join(Deno.cwd(), p);
    try {
      return createOk(await import(absPath));
    } catch (e) {
      return createErr(
        new Error(`Failed to load Tailwind config from ${absPath}: ${e}`),
      );
    }
  };
