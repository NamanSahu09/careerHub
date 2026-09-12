const app = require("../careerhub-backend/src/app");
const connectDB = require("../careerhub-backend/src/config/db");

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
