// mon-projet-auth/models/refreshtoken.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refreshToken", {
    token: {
      type: Sequelize.STRING,
    },
    expiryDate: {
      type: Sequelize.DATE,
    },
  });

  RefreshToken.createToken = async function(user) {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + 86400); // 24 heures

    let _token = uuidv4();

    const refreshToken = await this.create({
      token: _token,
      userId: user.id,
      expiryDate: expiredAt.getTime(),
    });

    return refreshToken.token;
  };

  RefreshToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  return RefreshToken;
};