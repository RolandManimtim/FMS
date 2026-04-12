import type { Method } from "axios";

export interface IClientRequest {
  method: Method;
  url: string;
  data?: unknown;
}
