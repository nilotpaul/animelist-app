import { rtkError } from "types/custom.err";

export function apiError(error: unknown): error is rtkError {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as Record<string, unknown>)?.data === "object"
  );
}
