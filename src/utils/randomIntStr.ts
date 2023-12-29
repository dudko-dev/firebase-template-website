/**
 * Generate random N-digital string
 *
 * @internal
 * @return - N-digital string
 */
export const randomIntStr = (length: number) =>
  new Array(length)
    .fill(null)
    .map(() => Math.floor(Math.random() * 10))
    .join('');
