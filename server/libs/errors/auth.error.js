class AuthError {

  constructor(code, status, error) {
    Error.call(this, error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'UnauthenticatedError';
    this.message = error.message;
    this.code = code;
    this.status = status;
    this.inner = error;
  }

}
module.exports = AuthError;
