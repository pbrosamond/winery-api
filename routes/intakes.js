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

const router = express.Router();

router
  .post("/", async (req, res) => {
    try {
      const requiredfields = [
        "docket_id",
        "intake_date",
        "bins",
        "total_weight",
        "tare_weight",
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
      const { docket_id, intake_date, bins, total_weight, tare_weight } = req.body;

      if (!docket_id && !intake_date && !bins && !total_weight && !tare_weight) {
        return res.status(400).send(`Please fill all required docket fields`);
      }

      // Insert new intake item into the database
      const result = await database("intakes").insert({
        docket_id,
        intake_date,
        bins,
        total_weight,
        tare_weight,
        fruit_weight: total_weight-tare_weight,
        predicted_volume: (total_weight-tare_weight)*0.75
      });

      const newIntake = result[0];
      const createdIntake = await database("intakes as i")
        .select("i.*", "d.docket_name") // TODO
        .join("dockets as d", "i.docket_id", "d.docket_id")
        .where({
          intake_id: newIntake,
        })
        .first();

      res.status(201).send(createdIntake);
    } catch (error) {
      console.log("this is the error you are looking for", error)
      res.status(500).send(`Error creating docket: ${error}`);
    }
})
  .get('/', async (_req, res) => {
    try {
      const data = await database("intakes as i")
        .select("i.*", "d.*")
        .join("dockets as d", "i.docket_id", "d.docket_id")
      res.status(200).json(data);
    } catch (error) {
      // Return Internal Server Error 500, if the error occurs at the backend
      res.status(500).send(`Error retrieving docket: ${error}`);
    }
});

export default router;