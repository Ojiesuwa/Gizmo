export const payWithPaystack = (email, amount, onSuccess, onClose) => {
  const handler = window.PaystackPop.setup({
    key: "pk_test_14ff670542226f74ad9c9cf1c4faeb5928c24ed3", // Replace with your Paystack public key
    email: email,
    amount: amount * 100, // Convert amount to kobo
    currency: "NGN",
    callback: (response) => {
      if (onSuccess) onSuccess(response);
    },
    onClose: () => {
      if (onClose) onClose();
    },
  });
  handler.openIframe();
};
