import { Controller, Get, Req, HttpException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Controller()
export class OrdersController {
  @Get("protected")
  async getProtected(@Req() req) {
    try {
      const authHeader = req.headers["authorization"] || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : req.cookies?.jwt;

      if (!token) throw new HttpException("No token provided", 401);

      const secret = process.env.JWT_SECRET;
      const decoded: any = jwt.verify(token, secret);

      return {
        message: "This is protected data from backend",
        user: { id: decoded.sub, email: decoded.email },
        orders: [
          { id: 1, item: "Product A", price: 100 },
          { id: 2, item: "Product B", price: 50 },
          { id: 3, item: "Product A", price: 100 },
        ],
      };
    } catch (err: any) {
      throw new HttpException("Unauthorized: " + err.message, 401);
    }
  }
}
