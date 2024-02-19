import knex from "knex";
import * as express from 'express';
import validatingFields from "../utils/formValidation.js";

const database = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
});
// database.migrate.latest();

const router = express.Router();

router
  .post("/", async (req, res) => {
    try {
      const requiredfields = [
        "vintage",
        "grower",
        "varietal",
        "vineyard",
        "block",
        "row",
      ];

      // Validating the fields
      const valResult = validatingFields(req.body, requiredfields);

      if (valResult.checkCode === 1) {
        return res
          .status(400)
          .send(`Post body does not include ${valResult.field}`);
      }

      if (valResult.checkCode === 2) {
        return res.status(400).send(`${valResult.field} should not be empty`);
      }

      // Check if the warehouse_id value exists in the warehouses table
      const { vintage, grower, varietal, vineyard, block, row } = req.body;

      if (!vintage && !grower && !varietal && !vineyard && !block && !row) {
        return res.status(400).send(`Please fill all required docket fields`);
      }

      // if (!(2000 <= vintage && vintage <= currentYear)) {
      //   return res.status(400).send(`Please select a valid year`);
      // }

      // Insert new inventory item into the database
      const result = await database("dockets").insert({
        vintage,
        grower,
        varietal,
        vineyard,
        block,
        row,
      });

      const newDocket = result[0];
      const createdDocket = await database("dockets")
        .select(["vintage", "grower", "varietal", "vineyard", "block", "row"])
        .where({
          id: newDocket,
        })
        .first();

      res.status(201).send(createdDocket);
    } catch (error) {
      res.status(500).send(`Error creating docket: ${error}`);
    }
})
  .get('/', async (_req, res) => {
    try {
      const data = await database("dockets")
        .select("id", "docket_name")
        // .first();
      res.status(200).json(data);
    } catch (error) {
      // Return Internal Server Error 500, if the error occurs at the backend
      res.status(500).send(`Error retrieving docket: ${error}`);
    }
})

export default router;
