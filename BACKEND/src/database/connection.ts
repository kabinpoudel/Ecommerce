import { HasOne, Sequelize } from "sequelize-typescript";
import { envConfig } from "../config/config";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import User from "./models/UserModel";
import Order from "./models/orderModel";
import OrderDetail from "./models/orderDetail";
import Payment from "./models/paymentModel";
import Cart from "./models/cartModel";

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

//User * order
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

Order.belongsTo(Payment, { foreignKey: "paymentId" });
Payment.hasOne(Order, { foreignKey: "paymentId" });

OrderDetail.belongsTo(Order, { foreignKey: "orderId" });
Order.hasOne(OrderDetail, { foreignKey: "orderId" });

OrderDetail.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderDetail, { foreignKey: "productId" });

Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

Cart.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Cart, { foreignKey: "productId" });

//exports
export default sequelize;
