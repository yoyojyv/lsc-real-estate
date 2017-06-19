const jwt = require('jsonwebtoken');
const unless = require('express-unless');

const UnauthorizedError = require('./../libs/errors/unauthorized.error');

module.exports = () => {

  const authMiddleware = (req, res, next) => {
    // read the token from header or url
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.indexOf(' ')) {
      token = authHeader.split(' ')[1];
    } else {
      next(new UnauthorizedError('unauthorized', { message: '인증되지 않은 요청입니다.' }));
      return;
    }

    // token does not exist
    if (!token) {
      // return res.sendStatus(403).json({
      //   success: false,
      //   message: 'not logged in',
      // });
      //
      // return res.sendStatus(403).json({
      //   message: '인증되지 않은 요청입니다.',
      // });
      next(new UnauthorizedError('unauthorized', { message: '인증되지 않은 요청입니다.' }));
      return;
    }

    // create a promise that decodes the token
    const p = new Promise(
      (resolve, reject) => {
        jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
          if (err) reject(err);
          resolve(decoded);
        });
      }
    );

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
      //      throw new UnauthorizedError('unauthorized-server-error', { message: '서버오류, 인증되지 않은 요청입니다.' });
      //       return res.sendStatus(403).json({
      //         message: '서버오류, 인증되지 않은 요청입니다.',
      //       });
      next(new UnauthorizedError('unauthorized', { message: '서버오류, 인증되지 않은 요청입니다.' }));
    };

    // process the promise
    p.then((decoded) => {
      req.decoded = decoded;
      req.isAdmin = req.decoded.role === 'super_admin' || req.decoded.role === 'admin';
      next();
    }).catch(onError);
  };

  authMiddleware.unless = unless;
  return authMiddleware;

};
