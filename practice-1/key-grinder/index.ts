import { Worker } from 'worker_threads';

const prefix = "darc"; // Замініть на потрібний префікс
const numThreads = 10; // Кількість потоків

function createWorker(prefix: string): Worker {
    return new Worker('./worker.js', { workerData: prefix });
}

async function main() {
    console.info(`Number of NodeJS Threads: ${numThreads} for prefix <${prefix}>`)

    const workers = [];
    const promises = [];

    for (let i = 0; i < numThreads; i++) {
        const worker=createWorker(prefix)
        const promise = new Promise<{publicKey:string,secretKey:string}>((resolve,reject)=> {
            worker.on('message',resolve);
        })
        promises.push(promise);
        workers.push(worker);

    }

    const startTime = new Date();
    const result = await Promise.race(promises);
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Завершуємо роботу інших воркерів
    workers.forEach(worker => worker.terminate());


    console.log(`✅ Done, spent time: ${duration} ms`)
    console.log(`Public key: ${result.publicKey}`)
    console.log(`Secret key: ${result.secretKey}`)


    process.exit(0);
}

main().catch(console.error);