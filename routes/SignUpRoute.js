import express from "express";
import { Register } from "../controllers/RegisterController.js";
import { Login, logout } from "../controllers/LoginController.js";
import isAuthenticated from "../utils/auth.js";
import { exec } from "child_process";
import { UpdatePassword , UpdateUsername } from "../controllers/UpdateController.js";
const router = express.Router();

router.route("/authcheck").post(isAuthenticated , async (req,res)=> {
  return res.status(200).json({
    message: "access granted"
  })
})


router.route("/register").post(Register);
router.route("/login").post(Login);

router.route("/logout").get(logout);
router.route("/changeusername").post(UpdateUsername);
router.route("/changepassword").post(UpdatePassword);
router.get("/stock/:symbol" , async (req, res) => {
  try {
    const symbol = req.params.symbol;
    exec(`python -c "import yfinance as yf; ticker = yf.Ticker('${symbol}'); data = ticker.history(period='1d'); print(data.to_json())"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        if (stderr.includes("No data found")) {
          return res.status(404).json({ message: "Stock data not found" });
        } else if (stderr.includes("symbol may be delisted")) {
          return res.status(404).json({ message: "Stock symbol may be delisted or invalid" });
        } else {
          return res.status(500).json({ message: "Internal server error" });
        }
      }
      const data = JSON.parse(stdout);
      const closePrices = data['Close'];
      const timestamps = Object.keys(closePrices);
      const latestTimestamp = timestamps[timestamps.length - 1];
      const livePrice = parseFloat(closePrices[latestTimestamp]).toFixed(2);
      const stockData = {
        stockName: symbol,
        livePrice: livePrice,
        dayHigh: data['High'] ? parseFloat(Math.max(...Object.values(data['High']))).toFixed(2) : 'N/A',
        dayLow: data['Low'] ? parseFloat(Math.min(...Object.values(data['Low']))).toFixed(2) : 'N/A'
      };
      res.json(stockData);
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/stock/:symbol/:timeframe" ,async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const timeframe = req.params.timeframe;
    exec(`python -c "import yfinance as yf; ticker = yf.Ticker('${symbol}'); data = ticker.history(period='${timeframe}'); print(data.to_json())"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        if (stderr.includes("No data found")) {
          return res.status(404).json({ message: "Stock data not found" });
        } else if (stderr.includes("symbol may be delisted")) {
          return res.status(404).json({ message: "Stock symbol may be delisted or invalid" });
        } else {
          return res.status(500).json({ message: "Internal server error" });
        }
      }
      const data = JSON.parse(stdout);
      const closePrices = data['Close'];
      const timestamps = Object.keys(closePrices);
      const latestTimestamp = timestamps[timestamps.length - 1];
      const earliestTimestamp = timestamps[0];
      const livePrice = parseFloat(closePrices[latestTimestamp]).toFixed(2);
      const startPrice = parseFloat(closePrices[earliestTimestamp]).toFixed(2);
      const stockData = {
        stockName: symbol,
        livePrice: livePrice,
        startPrice: startPrice,
        dayHigh: data['High'] ? parseFloat(Math.max(...Object.values(data['High']))).toFixed(2) : 'N/A',
        dayLow: data['Low'] ? parseFloat(Math.min(...Object.values(data['Low']))).toFixed(2) : 'N/A'
      };
      res.json(stockData);
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/stockdata/:symbol/cashflow",async (req, res) => {
  try {
    const symbol = req.params.symbol;

    exec(`python -c "import yfinance as yf; ticker = yf.Ticker('${symbol}'); data = ticker.cashflow; print(data.to_json())"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return res.status(500).json({ message: "Internal server error" });
      }

      const cashFlowData = JSON.parse(stdout);
  
      
      
      const topEntries = Object.entries(cashFlowData).slice(0, 7);
      const formattedCashFlow = topEntries.map(([timestamp, data]) => ({
        date: new Date(parseInt(timestamp)).toLocaleDateString(),
        freeCashFlow: data['Free Cash Flow'] || 'NA',
        repurchaseOfCapitalStock: data['Repurchase Of Capital Stock'] || 'NA',
        repaymentOfDebt: data['Repayment Of Debt'] || 'NA',
        issuanceOfDebt: data['Issuance Of Debt'] || 'NA',
        capitalExpenditure: data['Capital Expenditure'] || 'NA'
      }));

      

      res.json(formattedCashFlow);
    });
  } catch (error) {
    console.error("Error fetching cash flow data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/stockdata/:symbol/balancesheet",async (req, res) => {
  try {
    const symbol = req.params.symbol;

    exec(`python -c "import yfinance as yf; ticker = yf.Ticker('${symbol}'); data = ticker.balance_sheet; print(data.to_json())"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        return res.status(500).json({ message: "Internal server error" });
      }

      const balanceSheetData = JSON.parse(stdout);
      
      
      const topEntries = Object.entries(balanceSheetData).slice(0, 7);
      const formattedBalanceSheet = topEntries.map(([timestamp, data]) => ({
        date: new Date(parseInt(timestamp)).toLocaleDateString(),
        treasurySharesNumber: data['Treasury Shares Number'] || 'NA',
        ordinarySharesNumber: data['Ordinary Shares Number'] || 'NA',
        netDebt: data['Net Debt'] || 'NA',
        totalCapitalization: data['Total Capitalization'] || 'NA'
      }));

      res.json(formattedBalanceSheet);
    });
  } catch (error) {
    console.error("Error fetching balance sheet data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



export default router;
