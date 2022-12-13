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

   /** Using job id, return data about a job
    * 
    * Return {id, title, salary, equity, companyHandle, company}
    *    where company is {handle, name, description, numEmployees, logoUrl}
    * 
    * If not found, throw NotFoundError
    */
   static async get(id) {
      const jobRes = await db.query(
         `SELECT id,
                    title,
                    salary,
                    equity,
                    company_handle AS "companyHandle"
             FROM jobs
             WHERE id = $1`, [id]);

      const job = jobRes.rows[0];

      if (!job) throw new NotFoundError(`No job with id: ${id}`);

      const companiesRes = await db.query(
         `SELECT handle,
                    name,
                    description,
                    num_employees AS "numEmployees",
                    logo_url AS "logoUrl"
             FROM companies
             WHERE handle = $1`, [job.companyHandle]);

      delete job.companyHandle;
      job.company = companiesRes.rows[0];

      return job;
   }

   /** Update job data with 'data' -- similar to companies update()
    * 
    * "Partial Update" -- 'data' does not need to include all fields
    * 
    * Data can be = {title, salary, equity}
    * 
    * Return { id, title, salary, equity, companyHandle}
    * 
    * If not found, throw NotFoundError
    */
   static async update(id, data) {
      const { setCols, values } = sqlForPartialUpdate(
         data,
         {})
      const idVarIdx = "$" + (values.length + 1)
      const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                salary, 
                                equity,
                                company_handle AS "companyHandle"`;
      const result = await db.query(querySql, [...values, id]);
      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job: ${id}`)

      return job
   }

   /** Remove job 
    * 
    * If not found, throw NotFoundError
   */
   static async remove(id) {
      const result = await db.query(
         `DELETE
         FROM jobs
         WHERE id=$1
         RETURNING id`, [id]
      )
      const job = result.rows[0]

      if (!job) throw new NotFoundError(`No job with id: ${id}`)
   }
}

module.exports = Job