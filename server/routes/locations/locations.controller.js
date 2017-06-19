const dongRepository = require('../../repositories/location-dong.repository');
const guRepository = require('../../repositories/location-gu.repository');

exports.guList = async (req, res, next) => {
  let guList = await guRepository.getAll();
  res.send(guList);
};

exports.dongListByGuId = async (req, res, next) => {

  const guId = req.params.guId;
  let guList = await dongRepository.getAllByGuId(guId);
  res.send(guList);
};
