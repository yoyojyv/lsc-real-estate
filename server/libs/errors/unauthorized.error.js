const AuthError = require('./auth.error');

const statusCode = 403;
const name = 'UnauthorizedError';

class UnauthorizedError extends AuthError {

  constructor(code, error) {
    super(code, statusCode, error);
    this.name = name;
  }

}

module.exports = UnauthorizedError;
