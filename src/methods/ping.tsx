import { HttpsCallableResult } from "firebase/functions";
import { useCallableFn } from "../utils/useCallableFn";

const methodName = "v1_ping" as const;

export type PingResult = HttpsCallableResult<{ id: string }>;
export type PingData = {
  id?: string;
  scope?: string[];
};

export const usePing = () => useCallableFn<PingData, PingResult>(methodName);
