import knex from "knex";
import * as express from "express";
import validatingFields from "../utils/formValidation.js";

const database = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

const router = express.Router();

router
  .post("/", async (req, res) => {
    try {
      const requiredFields = [
        "vintage",
        "grower",
        "varietal",
        "vineyard",
        "block",
        "row",
      ];

      // Validating the fields
      const valResult = validatingFields(req.body, requiredFields);

      if (valResult.checkCode === 1) {
        return res
          .status(400)
          .send(`Post body does not include ${valResult.field}`);
      }

      if (valResult.checkCode === 2) {
        return res.status(400).send(`${valResult.field} should not be empty`);
      }

      const { vintage, grower, varietal, vineyard, block, row } = req.body;

      if (!vintage || !grower || !varietal || !vineyard || !block || !row) {
        return res.status(400).send(`Please fill all required docket fields`);
      }

      const currentYear = new Date().getFullYear();

      if (!(2000 <= vintage && vintage <= currentYear)) {
        return res.status(400).send(`Please select a valid year`);
      }

      // Generate docket_name
      const docketName = `${vintage}${String(grower)
        .substring(0, 2)
        .toUpperCase()}${String(varietal)
        .substring(0, 2)
        .toUpperCase()}${String(vineyard).substring(0, 2).toUpperCase()}${block
        .toString()
        .padStart(2, "0")}${row.toString().padStart(2, "0")}`;

      // Check if the docket already exists
      const exists = await database("dockets")
        .where({
          docket_name: docketName,
          vintage: vintage,
          grower: grower,
          varietal: varietal,
          vineyard: vineyard,
          block: block,
          row: row,
        })
        .first(); // Retrieves the first row that matches the query

      if (exists) {
        return res.status(400).send("Docket already exists");
      } else {
        // Insert new inventory item into the database
        const result = await database("dockets").insert({
          docket_name: docketName,
          vintage,
          grower,
          varietal,
          vineyard,
          block,
          row,
        });

        const newDocket = result[0];
        const createdDocket = await database("dockets")
          .select([
            "docket_name",
            "vintage",
            "grower",
            "varietal",
            "vineyard",
            "block",
            "row",
          ])
          .where({
            docket_id: newDocket,
          })
          .first();

        res.status(201).send(createdDocket);
      }
    } catch (error) {
      res.status(500).send(`Error creating docket: ${error}`);
    }
  })
  .get("/", async (_req, res) => {
    try {
      const data = await database("dockets").select("*");
      // .first();
      res.status(200).json(data);
    } catch (error) {
      // Return Internal Server Error 500, if the error occurs at the backend
      res.status(500).send(`Error retrieving docket: ${error}`);
    }
  })
  .delete('/:docket_id', async(req, res) => {
    try {
      const docketId = req.params.docket_id;
  
      if (!docketId) {
        return res.status(400).send('Intake ID is required for deletion');
      }
  
      // Perform the delete operation in the database
      const deletedDocket = await database('Dockets as d')
        .where('d.docket_id', docketId)
        .del();
  
      if (!deletedDocket) {
        return res.status(404).send('Docket not found');
      }
  
      res.status(204).send(); // 204 No Content indicates successful deletion
    } catch (error) {
      console.error('Error deleting docket:', error);
      res.status(500).send(`Error deleting docket: ${error}`);
    }
  });

export default router;
