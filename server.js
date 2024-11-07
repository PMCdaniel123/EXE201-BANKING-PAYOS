const express = require("express");
const cors = require("cors");
const PayOS = require("@payos/node");

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const payos = new PayOS(
  "5cc7dea9-5ad1-489b-9283-4ec0cf8afdca",
  "9f96eae7-c3b6-48ee-ae6c-5ec60c72c690",
  "c87c34ab075e9e238cd0d6ae3d9a5c05c6a05ef350ed6e3f0accb95fe16350db"
);

const YOUR_DOMAIN = "http://localhost:5173";

app.post("/create-checkout-session", async (req, res) => {
  const { total_amount, orderId, returnUrl, cancelUrl } = req.body;

  const order = {
    amount: total_amount,
    description: "Test Order",
    orderCode: orderId,
    returnUrl: `${YOUR_DOMAIN}/${returnUrl}`,
    cancelUrl: `${YOUR_DOMAIN}/${cancelUrl}`,
  };

  const paymentLink = await payos.createPaymentLink(order);
  res.json({ url: paymentLink.checkoutUrl });
});

app.post("/receive-hook", async (req, res) => {
  const event = req.body;
  console.log(event);
  res.json();
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});