// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

const express = require('express');
const serverless = require('serverless-http');
var cors = require('cors');
const fs = require('fs');
const fileName = './file.json';
const file = require(fileName);
const attendanceFileName = '../attendance.json'
const attendanceFile = require(attendanceFileName);

const app = express();

const router = express.Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

app.use(express.json());
app.use(cors())
const updateMasterData = (newUserData, deleteFlag) => {
    let rawdata = fs.readFileSync(fileName);
    let latestData = JSON.parse(rawdata);
    let cloneTableData = [...latestData];
    let index = cloneTableData.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
    if (index != -1)
        if (!deleteFlag) cloneTableData[index] = newUserData;
        else cloneTableData = cloneTableData.filter((val, indexNo) => indexNo !== index);
    else {
        cloneTableData.push(newUserData)
    }
    fs.writeFile(fileName, JSON.stringify(cloneTableData), function writeJSON(err) {
        if (err) return console.log(err);
        // console.log(JSON.stringify(file));
        console.log('writing to ' + fileName);
    });
}
router.post('/', function (req, res) {
    let { newUserData, deleteFlag} = req.body;
    updateMasterData(newUserData, deleteFlag);
	console.log(req.body);
	res.end();
})

router.get('/list', (req, res) => {
    console.log("testttttt")
    fs.readFile(fileName, 'utf8', function(err, data){
        if (err) return console.log(err);
        res.send(data);
        console.log(data);
    });
  })

  router.post('/backup', (req, res) => {
    const { updatefileName } =  req.body;
    fs.appendFile(`${updatefileName}.json`, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing to ' + fileName);
        res.send("updated Successfully");
      });
})

router.get('/checkinlist', (req, res) => {
    fs.readFile(attendanceFileName, 'utf8', function(err, data){
        if (err) return console.log(err);
        res.send(data);
        console.log(data);
    });
  })
  
  router.post('/checkin', (req, res) => {
    const { newUserData } = req.body;
    let rawdata = fs.readFileSync(attendanceFileName);
    let student = JSON.parse(rawdata);
    let cloneTableData = [...student]
    let index = cloneTableData.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
    if (index != -1)
        cloneTableData[index] = newUserData;
    else {
        cloneTableData.push(newUserData)
    }
    updateMasterData(newUserData, false);
    fs.writeFile(attendanceFileName, JSON.stringify(cloneTableData), function writeJSON(err) {
        if (err) return console.log(err);
        console.log('writing to ' + attendanceFileName);
        res.send("updated Successfully");
    });
})

app.use("/.netlify/functions/api/", router);

module.exports.handler = serverless(app);
