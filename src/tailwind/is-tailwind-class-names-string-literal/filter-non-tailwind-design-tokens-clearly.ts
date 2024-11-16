export const filterNonTailwindDesignTokensClearly: (
  token: string,
) => boolean = function (token) {
  const regex = /^[a-xA-X0-9\[\]:-]+$/;
  return token.match(regex) !== null;
};
