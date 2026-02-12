import localforage from "localforage";
import { CartOperation } from "./outboxService";
import api from "../../Utils/axiosInstance/axiosInstance";

export async function syncPendingOperation() {
  const storedData = await localforage.getItem<CartOperation[]>("cartOutbox");

  if (!storedData || storedData.length === 0) return;

  for (const data of storedData) {
    if (data.type == "ADD") {
      const existing = await api.get(`/cart/pcart/${data.item.productId}`).catch(() => null);

      if (existing && existing.data) {
        await api.patch(`/cart/product/${data.item.productId}`, {
          quantity: existing.data.quantity + 1
        });
      } else {
        await api.post(`/cart`, data.item);
      }
    }
     
    if (data.type === "REMOVE") {
      const existing = await api.get(`/cart/pcart/${data.item.productId}`).catch(() => null);
      if (!existing || !existing.data) continue;

      const newQty = existing.data.quantity - 1
      if (newQty > 0) {
        await api.patch(`/cart/product/${data.item.productId}`, { quantity: newQty });
      } else {
        await api.delete(`/cart/${data.item.productId}`);
      }
    }
  }

    await localforage.removeItem("cartOutbox");

}
