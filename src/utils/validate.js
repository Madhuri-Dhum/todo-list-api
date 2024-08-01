const jwt = require("jsonwebtoken");

const validateRequest = (req, res, next) => {
  if (req.path.startsWith("/auth") || req.path.startsWith("/download-csv")) {
    next();
  } else {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      const error = new Error("UnAuthorized");
      error.statusCode = 401;
      next(error);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      const error = new Error("UnAuthorized");
      error.statusCode = 401;
      next(error);
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
      if (err) {
        const error = new Error("Forbidden");
        error.statusCode = 403;
        next(error);
      } else {
        req.user = {
          _id: result._id,
          role: result.role,
        };
        next();
      }
    });
  }
};

module.exports = validateRequest;
