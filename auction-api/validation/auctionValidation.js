const Joi = require('joi');

const searchAuctionSchema = Joi.object({
  keyword: Joi.string().trim().min(2).max(100).optional(), // ★ max(100) がここにあるか確認
  min_price: Joi.number().min(0).optional(),
  max_price: Joi.number().min(0).optional(),
});

const validateSearchAuction = (req, res, next) => {
  const { error } = searchAuctionSchema.validate(req.query); // ★ req.query をバリデートしているか確認

  if (error) {
    return res.status(400).json({ message: error.details[0].message }); // ★ 400エラーが返されるか確認
  }
  next();
};

module.exports = {
  validateSearchAuction,
};