import jwt from "jsonwebtoken";

//? Tokens Service
export const getToken = async ({ id, email, role }) => {
  try {
    const accessToken = jwt.sign(
      { id, email, role },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });
    return {accessToken,refreshToken};
  } catch (error) {
    console.log(error);
    throw new Error("Error while Creating Token");
  }
};
