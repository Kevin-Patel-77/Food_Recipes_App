import localForage from "localforage";
import { CartItem } from "./CartSlice";

export type CartOperation =
  | { type: "ADD";item: CartItem }
  | { type: "REMOVE"; item: CartItem };


export async function pushToOutbox(op: CartOperation) {
  const existing = (await localForage.getItem<CartOperation[]>("cartOutbox")) || [];
  existing.push(op);
  await localForage.setItem("cartOutbox", existing);
}