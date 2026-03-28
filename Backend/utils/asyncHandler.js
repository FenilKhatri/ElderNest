const asyncHandler = (fn) => {
  if (typeof fn !== "function")
    throw new Error("asyncHandler expects a function");
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
