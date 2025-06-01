import { Model, Table, Column, DataType, AllowNull } from "sequelize-typescript";

@Table({
  tableName: "carts",
  modelName: "Cart",
  timestamps: true,
})
class Cart extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare quantity: Number;
}
export default Cart;
