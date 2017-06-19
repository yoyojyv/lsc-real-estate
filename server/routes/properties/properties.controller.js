const propertyRepository = require('../../repositories/property.repository');
const RealProperty = require('../../models/real-property');

exports.propertiesPage = async (req, res, next) => {
  let page = await propertyRepository.getPagedProperties(req.pageParam);
  res.send(page);
};

exports.propertyDetail = async (req, res, next) => {
  const id = req.params.id;

  // TODO 해당 사용자 권한에 따라서 리스트 가져오로록 수정
  let property = null;

  if (req.isAdmin) {
    property = await propertyRepository.getPropertyDetail(id);
  } else {
    property = await propertyRepository.getPropertyShort(id);
  }

  if (!property || property.deleteYn === 'Y') {
    return res.status(400).send({ error: 'Invalid request' });
  }

  res.send(property);
};

exports.removeProperty = async (req, res, next) => {

  if (!req.isAdmin) {
    return res.status(400).send({ error: 'Invalid request' });
  }

  const id = req.params.id;
  let result = await propertyRepository.updateToRemoved(id);
  res.send({ success: result });

};

exports.saveProperty = async (req, res, next) => {

  if (!req.isAdmin) {
    return res.status(400).send({ error: 'Invalid request' });
  }

  let property = req.body;

  const id = property._id;
  if (id) {
    let existProperty = await propertyRepository.getPropertyDetail(id);
    if (!existProperty) {
      return res.status(400).send({ error: 'Invalid request' });
    }
  } else {
    property._id = null;
    property.no = null;
    property.personInCharge = req.decoded._id;
  }

  const result = await propertyRepository.saveProperty(property);
  res.send({ success: result });

};
