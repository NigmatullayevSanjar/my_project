module.exports = function(err, req, res, next){
  console.error(err && err.stack ? err.stack : err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message || err });
};
