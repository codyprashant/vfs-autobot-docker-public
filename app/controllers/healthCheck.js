const connectionCheck = async (req, res, next) => {
    try {
      res.json({ status:"SUCCESS" });
    } catch (error) {
      next(error);
    }
  };

  module.exports = {
    connectionCheck
  };
  