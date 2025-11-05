import { Controller, Get, Req, HttpException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

@Controller("bookings")
export class BookingsController {
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

      const bookings = [
        {
          id: 101,
          title: "Booking — Sea View Apartment",
          date: "2025-11-01",
          price: 120,
        },
        {
          id: 102,
          title: "Booking — City Center Studio",
          date: "2025-11-05",
          price: 80,
        },
        {
          id: 103,
          title: "Booking — Family House",
          date: "2025-11-10",
          price: 200,
        },
        {
          id: 104,
          title: "Booking — Beach Cottage",
          date: "2025-11-12",
          price: 150,
        },
        {
          id: 105,
          title: "Booking — Mountain Cabin",
          date: "2025-11-18",
          price: 180,
        },
      ];

      return {
        message: "Protected bookings data",
        user: { id: decoded.sub, email: decoded.email },
        bookings,
      };
    } catch (err: any) {
      throw new HttpException("Unauthorized: " + err.message, 401);
    }
  }
}
