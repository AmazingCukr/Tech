import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

// Middleware pro povolení CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Proxy endpoint
app.get("/api/ares/:ico", async (req, res) => {
  const { ico } = req.params;

  try {
    const response = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      return res.status(response.status).json({ error: "ARES API error" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server běží na http://localhost:${PORT}`);
});
