const AuthError = require('./auth.error');

const statusCode = 401;
const name = 'UnauthenticatedError';

class UnauthenticatedError extends AuthError {

  constructor(code, error) {
    super(code, statusCode, error);
    this.name = name;
  }

}
module.exports = UnauthenticatedError;
