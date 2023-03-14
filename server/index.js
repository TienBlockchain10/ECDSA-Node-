const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04c599595c17238c347830796c6510a523b346278a24af7ba77da5b723e8693f0de695da83db23f14fb0e8131c33b76556dde359a8b8b2d2a6b6a40aaddfcbee35": 1,
  "048f88f4ae250b8402def681555f204484ab691195961907c982062d1573158bcbf52ae1f4903187f490ae14c9e29f94a144ec9f33e9cbd7d98b7352c1f1cd1d06": 50,
  "0424cb8d7212d6cf6235dd7c5d17d3dd9c5d794a39e24b58089d7131e05227a0bb18605058050deea245481e0c4c1b81344b4e6ba10007e2631c6c66286a8da822": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
