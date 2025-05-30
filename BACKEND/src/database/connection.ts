import { HasOne, Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./models/productModel";
import Category from "./models/categoryModel";

const sequelize = new Sequelize(envConfig.dburl as string, {
  models: [__dirname + "/models"],
  logging: console.log,
});

try {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Sucessfully Connected");
    })
    .catch((err) => {
      console.log("Auth Error", err);
    });
} catch (error) {
  console.log("Something Happened", error);
}

sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("local changes injected to database sucessfully");
});

//relationships
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasOne(Product, { foreignKey: "categoryId" });
export default sequelize;
