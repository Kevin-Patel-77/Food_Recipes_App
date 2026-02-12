import localForage from "localforage";
import { CartData } from "./CartSlice";

export type CartOperation = { type: "ADD"; item: CartData } | { type: "REMOVE"; item: CartData };

export async function pushToOutbox(op: CartOperation) {
  const existing = (await localForage.getItem<CartOperation[]>("cartOutbox")) || [];
  existing.push(op);
  await localForage.setItem("cartOutbox", existing);
}
