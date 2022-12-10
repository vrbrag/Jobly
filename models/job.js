"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
   static async create({ title, salary, equity, companyHandle }) {
      const result = await db.query(
         `INSERT INTO jobs
             (title, salary, equity, company_handle)
             VALUES ($1, $2, $3, $4)
             RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
         [
            title,
            salary,
            equity,
            companyHandle,
         ],
      );
      let job = result.rows[0];

      return job;
   }
}

module.exports = Job