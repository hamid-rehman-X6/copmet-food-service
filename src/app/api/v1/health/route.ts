import { success } from "@/server/api/response";

export function GET() {
  return success({ status: "ok", timestamp: new Date().toISOString() }, "API is healthy.");
}
