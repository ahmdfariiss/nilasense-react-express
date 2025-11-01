const database = require("./database");

module.exports = {
  database,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: "1d",
  },
  mlService: {
    url: process.env.ML_SERVICE_URL || "http://localhost:5002",
  },
  midtrans: {
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  },
};
