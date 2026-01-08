import localforage from "localforage";
import { CartOperation } from "./outboxService";
import axios from "axios";

export async function syncPendingOperation() {
  const storedData = await localforage.getItem<CartOperation[]>("cartOutbox");

  if (!storedData || storedData.length === 0) return;

  for (const data of storedData) {
    if (data.type == "ADD") {
      const existing = await axios.get(`/api/cart/${data.item.id}`).catch(() => null);

      if (existing && existing.data) {
        await axios.patch(`/api/cart/${data.item.id}`, {
          quantity: existing.data.quantity + 1
        });
      } else {
        await axios.post(`/api/cart`, data.item);
      }
    }
         
    if (data.type === "REMOVE") {
      const existing = await axios.get(`/api/cart/${data.item.id}`).catch(() => null);
      if (!existing || !existing.data) continue;

      const newQty = existing.data.quantity - 1
      if (newQty > 0) {
        await axios.patch(`/api/cart/${data.item.id}`, { quantity: newQty });
      } else {
        await axios.delete(`/api/cart/${data.item.id}`);
      }
    }
  }

    await localforage.removeItem("cartOutbox");

}
