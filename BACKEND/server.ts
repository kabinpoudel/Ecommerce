import adminseeder from "./adminSeeder";
import { app } from "./src/app";
import { envConfig } from "./src/config/config";
import categoryController from "./src/controllers/categoryController";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./src/database/models/UserModel";
import Order from "./src/database/models/orderModel";

function startServer() {
  const port = envConfig.port || 4000;
  const server = app.listen(port, () => {
    categoryController.seedCategory();
    console.log("Server has started at port " + port);
    adminseeder();
  });
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  let onlineUsers: { socketId: string; userId: string; role: string }[] = [];
  let addToOnlineUsers = (socketId: string, userId: string, role: string) => {
    console.log("in addtoonline user");
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({ socketId, userId, role });
    console.log(onlineUsers);
  };

  io.on("connection", (socket) => {
    const { token } = socket.handshake.headers; //jwt token
    if (token) {
      jwt.verify(token as string, envConfig.jwtSecretKey, async (err: any, result: any) => {
        if (err) {
          socket.emit("err", err);
        } else {
          const userData = await User.findByPk(result.userid);
          if (!userData) {
            socket.emit("err", "No user found with that token");
            return;
          }
          console.log(userData);

          addToOnlineUsers(socket.id, userData.id, userData.role);
        }
      });
    }
    socket.on("updateOrderStatus", async (data) => {
      const { status, orderId, userId } = data;
      const findUser = onlineUsers.find((user) => user.userId == userId);
      if (findUser) {
        await Order.update(
          {
            orderStatus: status,
          },
          {
            where: {
              id: orderId,
            },
          }
        );
        io.to(findUser.socketId).emit("success", "Order Status Updated");
      } else {
        socket.emit("err", "User is not Online");
      }
    });
    socket.on("disconnect", async (reason) => {
      console.log(`Socket Disconnected: ${socket.id}, Reason: ${reason}`);
      onlineUsers = onlineUsers.filter((user) => user.socketId != socket.id);
      console.log(onlineUsers);
    });
  });
}

startServer();
