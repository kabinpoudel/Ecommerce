import { Table, Column, Model, DataType } from "sequelize-typescript";
import { OrderStatus } from "../../globals/types";

@Table({
  tableName: "orders",
  modelName: "Order",
  timestamps: true,
})
class Order extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [10, 10],
        msg: "Phone number must be 10 Digit.",
      },
    },
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare addressLine: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare zipCode: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare totalAmount: Number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare firstName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare lastName: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;
  @Column({
    type: DataType.ENUM(
      OrderStatus.Cancelled,
      OrderStatus.Delivered,
      OrderStatus.OnTheWay,
      OrderStatus.Pending,
      OrderStatus.Preparation
    ),
    defaultValue: OrderStatus.Pending,
  })
  declare orderStatus: string;
}

export default Order;
