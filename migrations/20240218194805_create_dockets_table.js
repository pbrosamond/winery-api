/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = function (knex) {
    return knex.schema.createTable('dockets', (table) => {
      table.increments('id').primary();
      table.integer('vintage').notNullable();
      table.string('varietal').notNullable();
      table.string('grower').notNullable();
      table.string('vineyard').notNullable();
      table.string('block').notNullable();
      table.string('row').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export const down = function (knex) {
    return knex.schema.dropTable('dockets');
  };