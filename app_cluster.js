const cluster = require('cluster');
const cpus = require('os').cpus();


function startWorker() {
    const worker = cluster.fork();
    console.log(`CLUSTER: Worker ${worker.id} started`);
}

if (cluster.isMaster) {
    const cpusCount = cpus.length;

    console.log(`Master cluster setting up '${cpusCount}' workers...`);

    cpus.forEach(() => {
        startWorker();
    });

    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    });
    // log any workers that disconnect; if a worker disconnects, it
    // should then exit, so we'll wait for the exit event to spawn
    // a new worker to replace it
    cluster.on('disconnect', (worker) => {
        console.log(`CLUSTER: Worker ${worker.id} disconnected from the cluster.`);
    });
    // when a worker dies (exits), create a worker to replace it
    cluster.on('exit', (worker, code, signal) => {
        console.log(`CLUSTER: Worker ${worker.id} died with exit code ${code} (${signal})`);
        startWorker();
    });
} else {
    // start our app on worker; see app.js
    require('./app.js');
}
