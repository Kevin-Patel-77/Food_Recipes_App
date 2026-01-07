import localforage from "localforage";

const lf = localforage.createInstance({
  name: "recipes-db",
  storeName: "recipes",
});

export default lf;
