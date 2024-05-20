// class ApiError extends Error {
//   constructor(
//     statusCode,
//     message = "somthing went wrong",
//     errors = [],
//     stack = ""
//   ) {
//     super(message),
//       (this.statusCode = statusCode),
//       (this.data = null),
//       (this.message = message),
//       (this.success = false),
//       (this.errors = errors);

//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// export { ApiError };

class ApiError {
  constructor(statusCode, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiError };
