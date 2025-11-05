import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET ||
        "9b1c1a5f2d7e4a9b3c6d2f0e7a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6789",
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
