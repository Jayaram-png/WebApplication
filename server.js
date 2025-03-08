const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve all static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(".")); // Serve all static files from the current directory

// Dummy user data for demonstration
let users = {
  user123: {
    password: "password123",
    accounts: [
      { bank: "Bank A", balance: 5000 },
      { bank: "Bank B", balance: 12000 },
    ],
    creditScore: 720,
    bills: [
      { biller: "Electricity", amount: 100, date: "2025-02-15" },
      { biller: "Internet", amount: 50, date: "2025-02-10" },
    ],
  },
  // Add more users here as needed
};

// 1. User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    return res.json({ success: true, message: "Login successful", username });
  }
  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// 2. Fetch Account Details
app.get("/accounts/:username", (req, res) => {
  const { username } = req.params;
  if (users[username]) {
    return res.json(users[username].accounts);
  }
  return res.status(404).json({ message: "User not found" });
});

// 3. Fetch Credit Score
app.get("/credit-score/:username", (req, res) => {
  const { username } = req.params;
  if (users[username]) {
    return res.json({ creditScore: users[username].creditScore });
  }
  return res.status(404).json({ message: "User not found" });
});

// 4. Process Bill Payment
app.post("/pay-bill", (req, res) => {
  const { username, amount, biller } = req.body;
  if (users[username]) {
    // Check if the user has enough balance in any of the accounts
    let hasBalance = false;
    users[username].accounts.forEach(account => {
      if (account.balance >= amount) {
        account.balance -= amount;
        users[username].bills.push({
          biller,
          amount,
          date: new Date().toISOString().split('T')[0]
        });
        hasBalance = true;
        return;
      }
    });

    if (hasBalance) {
      return res.json({ success: true, message: `Paid $${amount} to ${biller}` });
    } else {
      return res.status(400).json({ success: false, message: "Insufficient funds" });
    }
  }
  return res.status(404).json({ success: false, message: "User not found" });
});

// 5. Update Credentials
app.post("/update-password", (req, res) => {
  const { username, newPassword } = req.body;
  if (users[username]) {
    users[username].password = newPassword;
    return res.json({ success: true, message: "Password updated successfully" });
  }
  return res.status(404).json({ success: false, message: "User not found" });
});

// 6. Fetch User's Bills
app.get("/bills/:username", (req, res) => {
  const { username } = req.params;
  if (users[username]) {
    return res.json(users[username].bills);
  }
  return res.status(404).json({ message: "User not found" });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`IBMS API running on http://localhost:${PORT}`);
});
