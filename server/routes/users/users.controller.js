const userRepository = require('../../repositories/user.repository');
const bcrypt = require('bcryptjs');

exports.usersPage = async (req, res, next) => {

  if (!req.isAdmin) {
    return res.status(400).send({ error: 'Invalid request' });
  }

  let page = await userRepository.getPagedUsers(req.pageParam);
  res.send(page);
};

exports.userDetail = async (req, res, next) => {

  if (!req.isAdmin) {
    return res.status(400).send({ error: 'Invalid request' });
  }

  const id = req.params.id;
  let user = await userRepository.getUser(id);
  if (!user) {
    return res.status(400).send({ error: 'Invalid request' });
  }

  res.send(user);
};

exports.removeUser = async (req, res, next) => {

  if (req.decoded.role !== 'super_admin') {
    return res.status(400).send({ error: 'Invalid request' });
  }

  const id = req.params.id;
  let result = await userRepository.updateToRemoved(id);
  res.send({ success: result });

};

exports.saveUser = async (req, res, next) => {

  if (req.decoded.role !== 'super_admin') {
    return res.status(400).send({ error: 'Invalid request' });
  }

  let user = req.body;
  const id = user._id;
  if (id) {
    let existUser = await userRepository.getUser(id);
    if (!existUser) {
      return res.status(400).send({ error: 'Invalid request' });
    }

    // set password
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
  } else {
    user._id = null;
    user.created = new Date();

    // set password
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
  }

  if (!user.password) {
    delete user.password;
  }

  const result = await userRepository.saveUser(user);
  res.send({ success: result });
};
