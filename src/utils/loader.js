import emitter from "../emitter/emitter";

export const showLoader = (id, message) => {
  if (!id) return;
  // console.log$&

  emitter.emit("loader", { message, id });
};

export const hideLoader = (id) => {
  if (!id) return;
  return emitter.emit("hide-loader", id);
};
