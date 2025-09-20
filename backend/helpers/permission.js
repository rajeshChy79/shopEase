const userModel = require("../models/userModel");

const uploadProductPermission = async (userId) => {
  const user = await userModel.findById(userId);

  if (!user) {
    return false;
  }

  return user.role === "ADMIN";
};

module.exports = uploadProductPermission;
