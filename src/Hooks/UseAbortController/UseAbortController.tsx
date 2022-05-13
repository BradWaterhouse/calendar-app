import { useEffect } from "react";

export const useAbortController = (amount: number): AbortController[] => {
  const controllers = Array(amount).fill(new AbortController());

  useEffect((): (() => void) => {
    return (): void[] => controllers.map((controller: AbortController): void => controller.abort());
  }, []);

  return [...controllers];
};
