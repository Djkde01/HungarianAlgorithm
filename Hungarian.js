import { NewArray, ArrayCopy } from "./Methods.js";

/**
 * An implementation of the Hungarian algorithm for solving the assignment
 * problem. An instance of the assignment problem consists of a number of
 * workers along with a number of jobs and a cost matrix which gives the cost of
 * assigning the i'th worker to the j'th job at position (i, j). The goal is to
 * find an assignment of workers to jobs so that no job is assigned more than
 * one worker and so that no worker is assigned to more than one job in such a
 * manner so as to minimize the total cost of completing the jobs.
 *
 * An assignment for a cost matrix that has more workers than jobs will
 * necessarily include unassigned workers, indicated by an assignment value of
 * -1; in no other circumstance will there be unassigned workers. Similarly, an
 * assignment for a cost matrix that has more jobs than workers will necessarily
 * include unassigned jobs; in no other circumstance will there be unassigned
 * jobs. For completeness, an assignment for a square cost matrix will give
 * exactly one unique worker to each job.
 *
 * This version of the Hungarian algorithm runs in time O(n^3), where n is the
 * maximum among the number of workers and the number of jobs.
 *
 */

export class Hungarian {
    constructor(costMatrix) {
        this.dim = Math.max(costMatrix.length, costMatrix[0].length);
        this.rows = costMatrix.length;
        this.cols = costMatrix[0].length;

        this.costMatrix = [];

        //
        for (var w = 0; w < this.dim; w++) {
            if (w < costMatrix.length) {
                if (costMatrix[w].length != this.cols) {
                    throw new Error("Irregular cost matrix");
                }
                this.costMatrix[w] = ArrayCopy(costMatrix[w], this.dim, 0.0);
            } else {
                this.costMatrix[w] = NewArray(this.dim, 0.0);
            }
        }

        this.labelByWorker = NewArray(this.dim, 0.0);
        this.labelByJob = NewArray(this.dim, 0.0);
        this.minSlackWorkerByJob = NewArray(this.dim, 0);
        this.minSlackValueByJob = NewArray(this.dim, 0.0);
        this.committedWorkers = NewArray(this.dim, false);
        this.parentWorkerByCommittedJob = NewArray(this.dim, 0);
        this.matchJobByWorker = NewArray(this.dim, -1);
        this.matchWorkerByJob = NewArray(this.dim, -1);
    }
}
