const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const app = express();
const PORT = 3001;
const CSV_PATH = path.join(__dirname, "expenses.csv");

// Allowed category values — validated on both frontend and backend (security.md § 3.1)
const ALLOWED_CATEGORIES = [
  "Travel",
  "Meals",
  "Accommodation",
  "Office Supplies",
  "Software",
  "Training",
];

app.use(cors());
app.use(express.json());

// Helper: read and parse the CSV file
function readExpenses() {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(CSV_PATH)
      .pipe(
        parse({
          columns: true, // use first row as column names
          skip_empty_lines: true,
          trim: true,
        }),
      )
      .on("data", (row) => {
        records.push({
          id: Number(row.id),
          date: row.date,
          category: row.category,
          description: row.description,
          amount: parseFloat(row.amount),
          currency: row.currency,
        });
      })
      .on("end", () => resolve(records))
      .on("error", (err) => reject(err));
  });
}

// Helper: write the full expenses array back to CSV
async function writeExpenses(records) {
  const header = "id,date,category,description,amount,currency";
  const rows = records.map(
    (r) =>
      `${r.id},${r.date},${r.category},${r.description},${parseFloat(r.amount.toFixed(2))},${r.currency}`,
  );
  const csv = [header, ...rows].join("\n") + "\n";
  await fs.promises.writeFile(CSV_PATH, csv, "utf8");
}

// GET /api/expenses — return all expenses with optional filters
// Query params: category, dateFrom, dateTo
app.get("/api/expenses", async (req, res) => {
  try {
    let expenses = await readExpenses();

    const { category, dateFrom, dateTo } = req.query;

    if (category) {
      expenses = expenses.filter(
        (e) => e.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (dateFrom) {
      expenses = expenses.filter((e) => e.date >= dateFrom);
    }
    if (dateTo) {
      expenses = expenses.filter((e) => e.date <= dateTo);
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    res.json({
      count: expenses.length,
      total: parseFloat(total.toFixed(2)),
      currency: "USD",
      expenses,
    });
  } catch (err) {
    console.error("Error reading CSV:", err.message);
    res.status(500).json({ error: "Failed to read expenses data." });
  }
});

// GET /api/expenses/summary — totals grouped by category
app.get("/api/expenses/summary", async (req, res) => {
  try {
    const expenses = await readExpenses();

    const summary = expenses.reduce((acc, e) => {
      if (!acc[e.category]) {
        acc[e.category] = { category: e.category, count: 0, total: 0 };
      }
      acc[e.category].count += 1;
      acc[e.category].total += e.amount;
      return acc;
    }, {});

    const result = Object.values(summary).map((s) => ({
      ...s,
      total: parseFloat(s.total.toFixed(2)),
    }));

    res.json({ summary: result });
  } catch (err) {
    console.error("Error reading CSV:", err.message);
    res.status(500).json({ error: "Failed to read expenses data." });
  }
});

// PUT /api/expenses/:id — update a single expense record
app.put("/api/expenses/:id", async (req, res) => {
  try {
    // 1. Validate :id — must be a positive integer
    const idParam = req.params.id;
    const id = parseInt(idParam, 10);
    if (!Number.isInteger(id) || id <= 0 || String(id) !== idParam) {
      return res.status(400).json({ error: "Invalid expense ID" });
    }

    const { date, category, amount, description } = req.body;

    // 2. Required fields
    if (date === undefined || date === null || date === "") {
      return res.status(400).json({ error: "Field date is required" });
    }
    if (category === undefined || category === null || category === "") {
      return res.status(400).json({ error: "Field category is required" });
    }
    if (amount === undefined || amount === null || amount === "") {
      return res.status(400).json({ error: "Field amount is required" });
    }

    // 3. Date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date) || isNaN(Date.parse(date))) {
      return res
        .status(400)
        .json({ error: "Date must be in YYYY-MM-DD format" });
    }

    // 4. Amount must be a positive number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be a positive number" });
    }

    // 5. Category whitelist
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // 6. Load CSV and find the record
    const expenses = await readExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // 7. 90-day age check (age > 90 days is blocked; exactly 90 days is allowed)
    const expenseDate = new Date(expenses[index].date + "T00:00:00Z");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const diffMs = today.getTime() - expenseDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays > 90) {
      return res
        .status(400)
        .json({ error: "Cannot edit expenses older than 90 days" });
    }

    // 8. Build updated record — preserve id and currency
    const updatedExpense = {
      id: expenses[index].id,
      date,
      category,
      description: description !== undefined ? String(description) : "",
      amount: parseFloat(parsedAmount.toFixed(2)),
      currency: expenses[index].currency,
    };

    expenses[index] = updatedExpense;

    // 9. Write back to CSV
    await writeExpenses(expenses);

    res.json({
      count: 1,
      total: updatedExpense.amount,
      currency: updatedExpense.currency,
      expenses: [updatedExpense],
    });
  } catch (err) {
    console.error("Error updating expense:", err.message);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

app.listen(PORT, () => {
  console.log(`Expenses API running at http://localhost:${PORT}`);
  console.log(`  GET /api/expenses`);
  console.log(`  GET /api/expenses/summary`);
  console.log(`  PUT /api/expenses/:id`);
});
