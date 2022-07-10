const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const users = [];

//Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const user = users.find((user) => user.cpf === cpf);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  req.user = user;

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

/**
 * cpf        - string
 * name       - string
 * id         - uuid
 * statement  - []
 */
app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const userAlreadyExists = users.some((user) => user.cpf === cpf);

  if (userAlreadyExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({
    id: uuidv4(),
    cpf,
    name,
    statement: [],
  });

  return res.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { user } = req;

  return res.status(200).json(user.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { amount, description } = req.body;

  const { user } = req;

  const statementOperation = {
    amount,
    description,
    created_at: new Date(),
    type: "credit",
  };

  user.statement.push(statementOperation);

  return res.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body;

  const { user } = req;

  const balance = getBalance(user.statement);

  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  user.statement.push(statementOperation);

  return res.status(201).send();
});

app.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {
  const { user } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  console.log(dateFormat);

  const statement = user.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return res.status(200).json(statement);
});

app.put("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { name } = req.body;

  const { user } = req;

  user.name = name;

  return res.status(201).send();
});

app.get("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { user } = req;

  return res.status(200).json(user);
});

app.delete("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { user } = req;

  users.splice(user, 1);

  return res.status(200).json(users);
});

app.get("/balance", verifyIfExistsAccountCPF, (req, res) => {
  const { user } = req;

  const balance = getBalance(user.statement);

  return res.status(200).json(balance);
});

app.listen(3333);
