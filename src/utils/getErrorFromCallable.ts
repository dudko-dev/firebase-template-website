export const getErrorFromCallable = (err: Error | any): Error => {
  return new Error(
    (err as any)?.details?.details ||
      (err as any)?.details?.message ||
      "Unknown error"
  );
};
