import { NewArray, ArrayCopy } from "./Methods.js";

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
