import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Generate the JWT token with the user ID and sign it with the secret key
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

  // Set the token in a cookie with specified options
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Set to true in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

export default generateToken;
