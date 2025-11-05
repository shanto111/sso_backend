import { Controller, Post, Body, Res, HttpException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService.register(body.email, body.password);
      return { ok: true, user };
    } catch (err: any) {
      throw new HttpException(
        { message: err.message || "Registration failed" },
        400
      );
    }
  }

  @Post("login")
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const user = await this.authService.validateUser(
        body.email,
        body.password
      );
      if (!user) throw new HttpException("Invalid credentials", 400);

      const token = this.authService.issueToken(user);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      return { ok: true, token };
    } catch (err: any) {
      throw new HttpException({ message: err.message }, 400);
    }
  }
}
