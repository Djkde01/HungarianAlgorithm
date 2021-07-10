import { Hungarian } from "./Hungarian.js";
import { NewArray, ArrayFill, ArrayCopy } from "./Methods.js";

Hungarian.prototype.computeInitialFeasibleSolution = function() {
    for(var j = 0; j < this.dim; j++) {
        this.labelByJob[j] = Infinity;
    }

    for(var w = 0; w < this.dim; w++) {
        for(var j = 0; j < this.dim; j++) {
            if(this.costMatrix[w][j] < this.labelByJob[j]) {
                this.labelByJob[j] = this.costMatrix[w][j];
            }
        }
    }
};

Hungarian.prototype.execute = function() {
    this.reduce();
    this.computeInitialFeasibleSolution();
    this.greedyMatch();

    var w = this.fetchUnmatchedWorker();
    while(w < this.dim) {
        this.initializePhase(w);
        this.executePhase();
        w = this.fetchUnmatchedWorker();
    }

    var result = ArrayCopy(this.matchJobByWorker, this.rows);

    for(w = 0; w < result.length; w++) {
        if(result[w] >= this.cols) {
            result[w] = -1;
        }
    }

    return result;
};

Hungarian.prototype.executePhase = function() {
    while(true) {
        var minSlackWorker = -1,
            minSlackJob = -1;
        var minSlackValue = Infinity;

        for(var j = 0; j < this.dim; j++) {
            if(this.parentWorkerByCommittedJob[j] == -1) {
                if(this.minSlackValueByJob[j] < minSlackValue) {
                    minSlackValue = this.minSlackValueByJob[j];
                    minSlackWorker = this.minSlackWorkerByJob[j];
                    minSlackJob = j;
                }
            }
        }

        if(minSlackValue > 0) {
            this.updateLabeling(minSlackValue);
        }

        this.parentWorkerByCommittedJob[minSlackJob] = minSlackWorker;

        if(this.matchWorkerByJob[minSlackJob] == -1) {
            var committedJob = minSlackJob;
            var parentWorker = this.parentWorkerByCommittedJob[committedJob];
            while(true) {
                var temp = this.matchJobByWorker[parentWorker];
                this.match(parentWorker, committedJob);
                committedJob = temp;
                if(committedJob == -1) {
                    break;
                }
                parentWorker = this.parentWorkerByCommittedJob[committedJob];
            }
            return;

        } else {
            var worker = this.matchWorkerByJob[minSlackJob];
            this.committedWorkers[worker] = true;
            for(var j = 0; j < this.dim; j++) {
                if(this.parentWorkerByCommittedJob[j] == -1) {
                    var slack = this.costMatrix[worker][j] - this.labelByWorker[worker] - this.labelByJob[j];
                    if(this.minSlackValueByJob[j] > slack) {
                        this.minSlackValueByJob[j] = slack;
                        this.minSlackWorkerByJob[j] = worker;
                    }
                }
            }
        }
    }
};

Hungarian.prototype.fetchUnmatchedWorker = function() {
    var w;
    for(w = 0; w < this.dim; w++) {
        if(this.matchJobByWorker[w] == -1) {
            break;
        }
    }
    return w;
};

Hungarian.prototype.greedyMatch = function() {
    for(var w = 0; w < this.dim; w++) {
        for(var j = 0; j < this.dim; j++) {
            if(this.matchJobByWorker[w] == -1 && this.matchWorkerByJob[j] == -1 && this.costMatrix[w][j] - this.labelByWorker[w] - this.labelByJob[j] == 0) {
                this.match(w, j);
            }
        }
    }
};

Hungarian.prototype.initializePhase = function(w) {
    ArrayFill(this.committedWorkers, false);
    ArrayFill(this.parentWorkerByCommittedJob, -1);

    this.committedWorkers[w] = true;
    for(var j = 0; j < this.dim; j++) {
        this.minSlackValueByJob[j] = this.costMatrix[w][j] - this.labelByWorker[w] - this.labelByJob[j];
        this.minSlackWorkerByJob[j] = w;
    }
};

Hungarian.prototype.match = function(w, j) {
    this.matchJobByWorker[w] = j;
    this.matchWorkerByJob[j] = w;
};

Hungarian.prototype.reduce = function() {

    for(var w = 0; w < this.dim; w++) {
        var min = Infinity;
        for(var j = 0; j < this.dim; j++) {
            if(this.costMatrix[w][j] < min) {
                min = this.costMatrix[w][j];
            }
        }
        for(var j = 0; j < this.dim; j++) {
            this.costMatrix[w][j] -= min;
        }
    }

    var min = NewArray(this.dim, Infinity);

    for(var w = 0; w < this.dim; w++) {
        for(var j = 0; j < this.dim; j++) {
            if(this.costMatrix[w][j] < min[j]) {
                min[j] = this.costMatrix[w][j];
            }
        }
    }

    for(var w = 0; w < this.dim; w++) {
        for(var j = 0; j < this.dim; j++) {
            this.costMatrix[w][j] -= min[j];
        }
    }
};

Hungarian.prototype.updateLabeling = function(slack) {
    for(var w = 0; w < this.dim; w++) {
        if(this.committedWorkers[w]) {
            this.labelByWorker[w] += slack;
        }
    }

    for(var j = 0; j < this.dim; j++) {
        if(this.parentWorkerByCommittedJob[j] != -1) {
            this.labelByJob[j] -= slack;
        } else {
            this.minSlackValueByJob[j] -= slack;
        }
    }
};



function Test() {
    function ArrayEquals(a, b) {
        if(a.length == b.length) {
            for(var i = 0; i < a.length; ++i) {
                if(a[i] != b[i]) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }
    
    function Assert(matrix, solution) {

        var h = new Hungarian(matrix);
        var s = h.execute();

        if(ArrayEquals(solution, s)) {
            console.log("Solution correct!");
        } else {
            console.log("Failed: ", matrix, solution, s);
        }
    }
    
    Assert([
        [],
        []
    ], [-1, -1]);
    Assert([
        [1]
    ], [0]);
    Assert([
        [1],
        [1]
    ], [0, -1]);
    Assert([
        [1, 1]
    ], [0]);
    Assert([
        [1, 1],
        [1, 1]
    ], [0, 1]);
    Assert([
        [1, 1],
        [1, 1],
        [1, 1]
    ], [0, 1, -1]);
    Assert([
        [1, 2, 3],
        [6, 5, 4]
    ], [0, 2]);
    Assert([
        [1, 2, 3],
        [6, 5, 4],
        [1, 1, 1]
    ], [0, 2, 1]);
    Assert([
        [1, 2, 3],
        [6, 5, 4],
        [1, 1, 1]
    ], [0, 2, 1]);
    Assert([
        [10, 25, 15, 20],
        [15, 30, 5, 15],
        [35, 20, 12, 24],
        [17, 25, 24, 20]
    ], [0, 2, 1, 3]);

}

Test();