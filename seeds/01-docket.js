/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('docket').insert([
        {    
            "id": "84e96018-4022-434e-80bf-000ce4cd12b8",
            "docket": "Docket 1",
            "vintage": "2024",
            "grower": "Blue Grouse",
            "varietal": "Chardonnay",
            "vineyard": "Imhof",
            "block": "23",
            "row": "VI"
        },
        {    
            "id": "84e96018-4022-434e-80bf-000ce4cd13ag",
            "docket": "Docket 2",
            "vintage": "2024",
            "grower": "Blue Grouse",
            "varietal": "Furmint",
            "vineyard": "Roma",
            "block": "1",
            "row": "IX"
        }
    ])
}