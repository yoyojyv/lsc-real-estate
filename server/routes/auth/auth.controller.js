const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userRepository = require('../../repositories/user.repository');
const UnauthenticatedError = require('../../libs/errors/unauthenticated.error');

exports.login = async (req, res, next) => {

  const { username, password } = req.body;
  const secret = req.app.get('jwt-secret');

  const user = await userRepository.findUserIncludePasswordByUsername(username);
  if (!user) {
    // user does not exist
    // throw new Error('login failed');
    // return res.sendStatus(401);
    throw new UnauthenticatedError('user_not_found', { message: '로그인 정보를 찾을 수 없습니다.' });
  }

  // check password
  if (!bcrypt.compareSync(password, user.password)) {
    // return res.sendStatus(401);
    throw new UnauthenticatedError('user_not_found', { message: '로그인 정보를 찾을 수 없습니다.' });
  }

  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
      secret,
      {
        expiresIn: '7d',
        issuer: 'lsc2521.ga',
        subject: 'userInfo',
      },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  })
    .then(token => token);

  res.json({
    message: 'logged in successfully',
    token,
  });

};

