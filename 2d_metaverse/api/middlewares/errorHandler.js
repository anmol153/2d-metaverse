const errorHandler = (err, req, res, next) => {
   const statusCode = err.statusCode || 500;
   const message = err.message || "Something went wrong";
   return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
      success: false,
   });
}
export default errorHandler;