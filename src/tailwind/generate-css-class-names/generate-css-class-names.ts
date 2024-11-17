import random from "jsr:@yuhenabc/random";

export const generateCSSClassNames: (marker: string, count?: number) => string =
  function (
    marker,
    count = 10,
  ) {
    return `${marker}_${random(count)}`;
  };
