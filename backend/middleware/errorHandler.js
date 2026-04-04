function errorHandler(err, req, res, next) {
  const isMongooseCastError =
    err?.name === "CastError" && err?.kind === "ObjectId";
  const isMongooseValidationError = err?.name === "ValidationError";

  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err?.message || "Server error";

  if (isMongooseCastError) {
    statusCode = 400;
    message = "Invalid task id";
  }

  if (isMongooseValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    message
  });
}

module.exports = errorHandler;

