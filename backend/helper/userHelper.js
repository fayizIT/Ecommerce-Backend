import User from "../models/userModel.js";



export const registerHelper = async (name, email, password) => {
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


