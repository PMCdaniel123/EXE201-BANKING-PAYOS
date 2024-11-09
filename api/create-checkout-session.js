const PayOS = require("@payos/node");

const payos = new PayOS(
  "5cc7dea9-5ad1-489b-9283-4ec0cf8afdca",
  "9f96eae7-c3b6-48ee-ae6c-5ec60c72c690",
  "c87c34ab075e9e238cd0d6ae3d9a5c05c6a05ef350ed6e3f0accb95fe16350db"
);

const YOUR_DOMAIN = "https://sunsetsoiree.vn";
// const YOUR_DOMAIN = "http://localhost:5173";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { total_amount, orderId, returnUrl, cancelUrl } = req.body;

    try {
      const order = {
        amount: total_amount,
        description: "Sunset Soiree Order",
        orderCode: orderId,
        returnUrl: `${YOUR_DOMAIN}/${returnUrl}`,
        cancelUrl: `${YOUR_DOMAIN}/${cancelUrl}`,
      };

      const paymentLink = await payos.createPaymentLink(order);
      return res.status(200).json({ url: paymentLink.checkoutUrl });
    } catch (error) {
      return res.status(500).json({ error: "Failed to create payment link" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
};
