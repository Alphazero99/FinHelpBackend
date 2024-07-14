import express from "express";
import yf from "yfinance";

const router = express.Router();

router.get("/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const data = await yf.getStockData(symbol);

    if (!data) {
      return res.status(404).json({ message: "Stock data not found" });
    }

    res.json({
      stockName: symbol,
      livePrice: data.close,
      dayHigh: data.high,
      dayLow: data.low
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
