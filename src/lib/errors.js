class AppError extends Error {
        constructor(message, statusCode) {
          super(message);
          this.message = message;
          this.statusCode = statusCode;
          this.isOperational = true;
      
          Error.captureStackTrace(this, this.constructor);
        }
      }
      
      class ValidationError extends AppError {
        constructor(message = 'Validation Error', errors = []) {
          super(message, 400); // 400 Bad Request is the typical status code for validation errors
          this.errors = errors; // Array of detailed validation errors
        }
      }
      
      // Existing error classes
      class BadRequestError extends AppError {
        constructor(message = 'Bad Request') {
          super(message, 400);
        }
      }
      
      class UnauthorizedError extends AppError {
        constructor(message = 'Unauthorized') {
          super(message, 401);
        }
      }
      
      class ForbiddenError extends AppError {
        constructor(message = 'Forbidden') {
          super(message, 403);
        }
      }
      
      class NotFoundError extends AppError {
        constructor(message = 'Not Found') {
          super(message, 404);
        }
      }
      
      class InternalServerError extends AppError {
        constructor(message = 'Internal Server Error') {
          super(message, 500);
        }
      }
      
      export { 
        AppError, 
        ValidationError, 
        BadRequestError, 
        UnauthorizedError, 
        ForbiddenError, 
        NotFoundError, 
        InternalServerError 
      };
      