const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const {
    promisify
} = require('util');
const fs = require('fs');
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

const dataDir = path.join(__dirname, "../data");

function mkdir(dirPath) {
    return new Promise((resolve, reject) => {
        exec(`mkdir -p ${dirPath}`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stdout);
        });
    })
}


function remove(filePath) {
    return new Promise((resolve, reject) => {
        exec(`rm ${filePath}`, (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(stdout);
        });
    })
}


let executing = "";
let taskStatus = "";

function checkTask(targetDir, filename) {
    if (executing === targetDir + filename) {
        return {
            statusCode: 202,
            statusMessage: `Executing ${taskStatus}%`
        };
    } else if (executing === "") {
        console.log(`INFO Assigned ${filename} APTED.`);
        taskStatus = "";
        let process = spawn("java", ["-jar", "CalculateTED.jar", "-c", "-s", targetDir, "-t", filename]);
        process.stdout.on("data", (data) => {
            taskStatus = data.toString().replace(/\n/g, "");
            if (taskStatus !== "") console.log(`INFO APTED ${taskStatus}`);
        });
        process.stderr.on("data", (data) => {
            let error = data.toString().replace(/\n/g, "");
            taskStatus = "error";
            console.log(`${error}`);
        });
        process.on("close", (code) => {
            if (taskStatus === "error") {
                console.log(`INFO ${filename} APTED exited with error.`);
            } else {
                console.log(`INFO ${filename} APTED exited.`);
            }
            executing = "";
            taskStatus = "";
        });
        process.on("error", (err) => {
            console.error(`ERR ${err}`);
            process.exit(1);
        });
        executing = targetDir + filename;
        return {
            statusCode: 202,
            statusMessage: "Assigned task"
        };
    } else {
        return {
            statusCode: 500,
            statusMessage: "Other task running.\nPlease retry later."
        };
    }
}


function getStatusCode(code) {
    switch (code) {
        case "ENOENT":
            return 404;
            break;
        case "EPERM":
            return 403;
            break;
        case "EBUSY":
            return 423;
            break;
        default:
            return 499;
    }
}

router.get('/is_exist', (req, res, next) => {
    const filePath = path.join(dataDir, req.query.id);
    promisify(fs.access)(filePath, fs.constants.R_OK | fs.constants.W_OK)
        .then(() => res.sendStatus(200))
        .catch(err => res.sendStatus(getStatusCode(err.code)));
});

router.get('/analyze_list', (req, res, next) => {
    promisify(fs.readdir)(dataDir)
        .then(list => {
            const filtered_list = list.filter(elm => {
                return (!elm.startsWith(".") && !elm.startsWith("_"));
            });
            res.status(200).json({
                analyze_list: filtered_list
            });
        })
        .catch(err => res.sendStatus(getStatusCode(err.code)));
});

// idに適したresult
router.get('/result', (req, res, next) => {
    // const targetDir = path.join(dataDir, req.query.id);
    const resultFile = path.join(dataDir, `${req.query.id}/result/result_2d.json`);
    promisify(fs.readFile)(resultFile, 'utf-8')
        .then(data => res.status(200).json(JSON.parse(data)))
        .catch(err => {
            let status = getStatusCode(err.code);
            let message = err.message;
            if (status === 404) {
                const {
                    statusCode,
                    statusMessage
                } = checkTask(targetDir, req.query.id);
                status = statusCode;
                message = statusMessage;
            }
            res.status(status).send(message);
        });
});

//title名の映画のsummaryファイル
router.get('/summary', (req, res, next) => {
    const targetDir = path.join(dataDir, req.query.id);
    const summary_file = path.join(targetDir, `summary/${req.query.title}`);
    promisify(fs.readFile)(summary_file, 'utf-8')
        .then(data => res.status(200).send(data))
        .catch(err => res.sendStatus(getStatusCode(err.code)));
});

module.exports = router;
