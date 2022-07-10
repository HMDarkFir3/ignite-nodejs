import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

const categoriesRoutes = Router();

const categories = [];

categoriesRoutes.post("/categories", (req, res) => {
  const { name, description } = req.body;

  categories.push({
    id: uuidv4(),
    name,
    description,
    created_at: new Date(),
  });

  return res.status(201).send();
});

categoriesRoutes.get("/categories", (req, res) => {
  return res.status(200).json(categories);
});

export { categoriesRoutes };
