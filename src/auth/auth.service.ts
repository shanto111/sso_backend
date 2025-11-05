import { Injectable } from "@nestjs/common";
import { MongoClient, Db } from "mongodb";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  private client: MongoClient;
  private db: Db;

  constructor(private jwtService: JwtService) {
    const uri = process.env.MONGODB_URI;
    if (!uri)
      throw new Error("Mongo URI is not defined in environment variables");
    this.client = new MongoClient(uri);
  }

  private async connect() {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db("sso_demo");
    }
  }

  async register(email: string, password: string) {
    await this.connect();
    const users = this.db.collection("users");
    const existing = await users.findOne({ email });
    if (existing) throw new Error("User already exists");
    const hashed = await bcrypt.hash(password, 10);
    const res = await users.insertOne({
      email,
      password: hashed,
      createdAt: new Date(),
    });
    return { id: res.insertedId, email };
  }

  async validateUser(email: string, password: string) {
    await this.connect();
    const users = this.db.collection("users");
    const user = await users.findOne({ email });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return user;
  }

  issueToken(user: any) {
    const payload = { sub: user._id.toString(), email: user.email };
    return this.jwtService.sign(payload);
  }
}
