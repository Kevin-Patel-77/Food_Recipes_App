import localForage from "localforage";
import { CartData } from "./CartSlice";

export type CartOperation = { type: "ADD"; item: CartData } | { type: "REMOVE"; item: CartData };

export async function pushToOutbox(op: CartOperation) {
  const existing = (await localForage.getItem<CartOperation[]>("cartOutbox")) || [];

  if (existing.length == 0) {
    existing.push(op);
  } else {
    const AvailableProduct = existing.find((prod) => prod.item.productId == op.item.productId);

    if (AvailableProduct) {
      if (AvailableProduct.type == "ADD") {
        AvailableProduct.item.quantity += 1;
      } else {
        AvailableProduct.item.quantity -= 1;
      }
    } else {
      existing.push(op);
    }
  }
  await localForage.setItem("cartOutbox", existing);
}
