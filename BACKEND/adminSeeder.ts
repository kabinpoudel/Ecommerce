import { envConfig } from "./src/config/config";
import User from "./src/database/models/UserModel";
import bcrypt from "bcrypt";
const adminseeder = async () => {
  const [data] = await User.findAll({
    where: {
      email: envConfig.adminEmail,
    },
  });
  if (!data) {
    await User.create({
      username: envConfig.adminUserName,
      password: bcrypt.hashSync(envConfig.adminPassword, 14),
      email: envConfig.adminEmail,
      role: "admin",
    });
    console.log("Admin Seeded !!!");
  } else {
    console.log("Admin already Seeded!");
  }
};
export default adminseeder;
