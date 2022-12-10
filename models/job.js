"use strict";

const { resourceLimits } = require("worker_threads");
const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs. */

class Job {
   /** POST create job
    * 
    * Create a job(from data), update db, return new job data
    * 
    * Returns {id, title, salary, equity, compnayHandle}
    */
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

   /** Find all jobs 
    * 
    * Returns [{id, title, salary, equity, companyHandle, companyName}]
    */
   static async findAll() {
      const result = await db.query(
         `SELECT 
            j.id,
            j.title,
            j.salary,
            j.equity,
            j.company_handle AS "companyHandle",
            c.name AS "companyName"
         FROM jobs j 
         LEFT JOIN companies AS c ON c.handle = j.company_handle`
      )
      return result.rows
   }
}

module.exports = Job