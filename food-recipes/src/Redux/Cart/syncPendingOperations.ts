import localforage from "localforage";
import api from "../../Utils/axiosInstance/axiosInstance.ts";
import type { CartOperation } from "./outboxService.ts";

export async function syncPendingOperation() {
  const storedData = await localforage.getItem<CartOperation[]>("cartOutbox");

  if (!storedData || storedData.length === 0) return;

  const remainingOperations: CartOperation[] = [];
  for (const data of storedData) {
    try {
      if (data.type == "ADD") {
        const existing = await api.get(`/cart/${data.item.productId}`).catch(() => null);

        if (existing && existing.data) {
          await api.patch(`/cart/product/${data.item.productId}`, {
            quantity: data.item.quantity,
          });
        } else {
          await api.post(`/cart/add`, {
            productId: data.item.productId,
            price: data.item.price,
          });
        }
      }

      if (data.type === "REMOVE") {
        const existing = await api.get(`/cart/${data.item.productId}`).catch(() => null);
        if (!existing || !existing.data) continue;

        if (existing.data.data.quantity > 1) {
          await api.patch(`/cart/product/${data.item.productId}`, {
            quantity: data.item.quantity,
          });
        } else {
          await api.delete(`/cart/${data.item.productId}`);
          return { ...data.item, quantity: 0 };
        }
      }
    } catch (error) {
      console.error("Sync failed for:", data);
      remainingOperations.push(data);
    }
  }

  if (remainingOperations.length > 0) {
    await localforage.setItem("cartOutbox", remainingOperations);
  } else {
    await localforage.removeItem("cartOutbox");
  }
}
