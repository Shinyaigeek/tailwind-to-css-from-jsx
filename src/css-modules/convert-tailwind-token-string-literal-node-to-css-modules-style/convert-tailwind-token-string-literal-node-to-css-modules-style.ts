import { TailwindTokensStringLiteralNodeProcessorType } from "../../generate-css-content-from-jsx/generate-css-content-from-jsx.ts";

export const convertTailwindTokenStringLiteralNodeToCSSModulesStyle:
  TailwindTokensStringLiteralNodeProcessorType = function (
    node,
    parent,
    className,
  ) {
    if (parent?.type === "JSXAttribute") {
      return {
        ...node,
        type: "JSXExpressionContainer",
        expression: {
          ...node,
          type: "MemberExpression",
          computed: false,
          optional: false,
          object: {
            ...node,
            type: "Identifier",
            name: "styles",
            decorators: null,
            optional: false,
            typeAnnotation: null,
          },
          property: {
            ...node,
            type: "Identifier",
            name: className,
            decorators: null,
            optional: false,
            typeAnnotation: null,
          },
        },
      };
    }

    return {
      ...node,
      type: "MemberExpression",
      computed: false,
      optional: false,
      object: {
        ...node,
        type: "Identifier",
        name: "styles",
        decorators: null,
        optional: false,
        typeAnnotation: null,
      },
      property: {
        ...node,
        type: "Identifier",
        name: className,
        decorators: null,
        optional: false,
        typeAnnotation: null,
      },
    };
  };
