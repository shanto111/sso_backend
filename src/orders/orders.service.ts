import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class OrdersService {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  createOrder(userId: string, product: string) {
    const token = this.jwtService.sign({ userId });
    return {
      message: `Order created for ${product}`,
      token,
    };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (err) {
      return { error: "Invalid token" };
    }
  }
}
