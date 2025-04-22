const { BlacklistCollection } = require("../config/ConnectDB.js");
//kiểm tra xem token có nằm trong danh sách đen hay không
async function isTokenBlacklisted(token) {
  return await BlacklistCollection.findOne({ token });
}

//thêm token vào danh sách đen
async function addTokenToBlacklist(token, expiresAt) {
  await BlacklistCollection.insertOne({
    token,
    expiresAt,
  });

  await BlacklistCollection.createIndex(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
  );
}

module.exports = { isTokenBlacklisted, addTokenToBlacklist };
