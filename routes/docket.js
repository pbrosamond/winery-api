const knex = require("knex")(require("../knexfile"));
const router = require("express").Router();

const { ValidatingFields } = require("../utils/formValidation");

router.post("/api/docket", async (req, res) => {
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
    const valResult = ValidatingFields(req.body, requiredfields);

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

    if (!(2000 <= vintage && vintage <= currentYear)) {
      return res.status(400).send(`Please select a valid year`);
    }

    // Insert new inventory item into the database
    const result = await knex("dockets").insert({
      vintage,
      grower,
      varietal,
      vineyard,
      block,
      row,
    });

    const newDocket = result[0];
    const createdDocket = await knex("dockets")
      .select(["vintage", "grower", "varietal", "vineyard", "block", "row"])
      .where({
        id: newDocket,
      })
      .first();

    res.status(201).send(createdInventory);
  } catch (error) {
    res.status(500).send(`Error creating docket: ${err}`);
  }
});
