const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const app = express();
const PORT = 3001;
const CSV_PATH = path.join(__dirname, "expenses.csv");

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

app.listen(PORT, () => {
  console.log(`Expenses API running at http://localhost:${PORT}`);
  console.log(`  GET /api/expenses`);
  console.log(`  GET /api/expenses/summary`);
});
