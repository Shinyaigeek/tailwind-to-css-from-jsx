const pseudoClassesTailwindTokenMaps = {
  hover: "&:hover",
  focus: "&:focus",
  "focus-within": "&:focus-within",
  "focus-visible": "&:focus-visible",
  active: "&:active",
  visited: "&:visited",
  target: "&:target",
  "*": "& > *",
  has: "&:has",
  first: "&:first-child",
  last: "&:last-child",
  only: "&:only-child",
  odd: "&:nth-child(odd)",
  even: "&:nth-child(even)",
  "first-of-type": "&:first-of-type",
  "last-of-type": "&:last-of-type",
  "only-of-type": "&:only-of-type",
  empty: "&:empty",
  disabled: "&:disabled",
  enabled: "&:enabled",
  checked: "&:checked",
  indeterminate: "&:indeterminate",
  default: "&:default",
  required: "&:required",
  valid: "&:valid",
  invalid: "&:invalid",
  "in-range": "&:in-range",
  "out-of-range": "&:out-of-range",
  "placeholder-shown": "&:placeholder-shown",
  autofill: "&:autofill",
  "read-only": "&:read-only",
} as const;

const pseudoElementsTailwindTokenMaps = {
  autofill: "&:autofill",
  "read-only": "&:read-only",
  before: "&::before",
  after: "&::after",
  "first-letter": "&::first-letter",
  "first-line": "&::first-line",
  marker: "&::marker",
  selection: "&::selection",
  file: "&::file-selector-button",
  backdrop: "&::backdrop",
  placeholder: "&::placeholder",
} as const;

const mediaQueriesTailwindTokenMaps = {
  sm: "@media (min-width: 640px)",
  md: "@media (min-width: 768px)",
  lg: "@media (min-width: 1024px)",
  xl: "@media (min-width: 1280px)",
  "2xl": "@media (min-width: 1536px)",
  // TODO: support custom breakpoints
  // 'min-[…]': '@media (min-width: …)',
  "max-sm": "@media not all and (min-width: 640px)",
  "max-md": "@media not all and (min-width: 768px)",
  "max-lg": "@media not all and (min-width: 1024px)",
  "max-xl": "@media not all and (min-width: 1280px)",
  "max-2xl": "@media not all and (min-width: 1536px)",
  // TODO: support custom breakpoints
  "max-[…]": "@media (max-width: …)",
  dark: "@media (prefers-color-scheme: dark)",
  portrait: "@media (orientation: portrait)",
  landscape: "@media (orientation: landscape)",
  "motion-safe": "@media (prefers-reduced-motion: no-preference)",
  "motion-reduce": "@media (prefers-reduced-motion: reduce)",
  "contrast-more": "@media (prefers-contrast: more)",
  "contrast-less": "@media (prefers-contrast: less)",
  print: "@media print",
} as const;

// TODO: support support queries
// const supportsQueries: Record<string, string> = {
//     'supports-[…]': '@supports (…)',
//   };

const attributesTailwindTokenMaps = {
  "aria-checked": '&[aria-checked="true"]',
  "aria-disabled": '&[aria-disabled="true"]',
  "aria-expanded": '&[aria-expanded="true"]',
  "aria-hidden": '&[aria-hidden="true"]',
  "aria-pressed": '&[aria-pressed="true"]',
  "aria-readonly": '&[aria-readonly="true"]',
  "aria-required": '&[aria-required="true"]',
  "aria-selected": '&[aria-selected="true"]',
  "aria-[…]": "&[aria-…]",
  "data-[…]": "&[data-…]",
} as const;

const directionAttributesTailwindTokenMaps = {
  rtl: '[dir="rtl"] &',
  ltr: '[dir="ltr"] &',
} as const;

const openAttributeTailwindTokenMaps = {
  open: "&[open]",
} as const;

export const pseudoTailwindTokenMaps = {
  ...pseudoClassesTailwindTokenMaps,
  ...pseudoElementsTailwindTokenMaps,
  ...mediaQueriesTailwindTokenMaps,
  ...attributesTailwindTokenMaps,
  ...directionAttributesTailwindTokenMaps,
  ...openAttributeTailwindTokenMaps,
  __NON_PSEUDO: "",
} as const;

export const splitPseudoTailwindTokens: (
  tokens: string[],
) => Record<keyof typeof pseudoTailwindTokenMaps, string[]> = function (
  tokens,
) {
  return tokens.reduce((acc, token) => {
    if (token.includes(":") === false) {
      if (acc.__NON_PSEUDO) {
        acc.__NON_PSEUDO.push(token);
      } else {
        acc.__NON_PSEUDO = [token];
      }

      return acc;
    }
    const [key, value] = token.split(":") as [
      keyof typeof pseudoTailwindTokenMaps,
      string,
    ];
    if (Object.keys(pseudoTailwindTokenMaps).includes(key)) {
      if (acc[key]) {
        acc[key].push(value);
      } else {
        acc[key] = [value];
      }
    }
    return acc;
  }, {} as Record<keyof typeof pseudoTailwindTokenMaps, string[]>);
};
