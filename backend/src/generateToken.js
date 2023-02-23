
const jwt= require("jsonwebtoken")

function generateJwtToken(user) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY environment variable is not defined");
  }
  console.log(user);
  const accessToken = jwt.sign(
    { username: user.username },
    process.env.SECRET_KEY,
    { expiresIn: "60m" }
  );
  return { accessToken, expiresIn: "60m" };
}

module.exports = generateJwtToken;
