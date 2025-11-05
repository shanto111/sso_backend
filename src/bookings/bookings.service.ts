import { Injectable } from "@nestjs/common";

@Injectable()
export class BookingsService {
  // placeholder for real DB logic later
  getDummy() {
    return { ok: true };
  }
}
