export const isTSX: (filename: string) => boolean = function (filename) {
  return /\.tsx$/.test(filename);
};
