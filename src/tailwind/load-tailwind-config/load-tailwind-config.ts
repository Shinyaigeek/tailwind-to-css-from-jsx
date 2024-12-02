import { createErr, createOk, Result } from "option-t/plain_result";
import type { Config } from "tailwindcss";
import { join } from "@std/path";

export const loadTailwindConfig: (p: string) => Promise<Result<Config, Error>> =
  async function (p) {
    const absPath = join(Deno.cwd(), p);
    
    try {
      const tailwindCSSConfigFileContents = await Deno.readTextFile(absPath);
      const blob = new Blob([tailwindCSSConfigFileContents], { type: 'application/javascript' });
      const blobUrl = URL.createObjectURL(blob);
      return createOk(await import(blobUrl));
    } catch (e) {
      return createErr(
        new Error(`Failed to load Tailwind config from ${absPath}: ${e}`),
      );
    }
  };
