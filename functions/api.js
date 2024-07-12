// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

const express = require('express');
const serverless = require('serverless-http');
var cors = require('cors');
const fs = require('fs');
const { MongoClient } = require("mongodb");

let uri =
  `mongodb+srv://Pooprav:8igvJKHVlWNlhk5g@poopravcluster0.clos40k.mongodb.net/?retryWrites=true&w=majority&appName=poopravCluster0`;
const client = new MongoClient(uri);

(async function () {
    try {
        await client.connect();
        const database = client.db("rpesanddips");
        const ratings = database.collection("gym_user");
        const cursor = ratings.find();
        await cursor.forEach(doc => console.dir(doc));
    } finally {
        await client.close();
    }
})()    

// // const fileName = './file.json';
// // const file = require(fileName);
// const attendanceFileName = '../attendance.json'
// const attendanceFile = require(attendanceFileName);

const app = express();

const router = express.Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

app.use(express.json());
app.use(cors())
const updateMasterData = async (newUserData, deleteFlag) => {
    const database = client.db("rpesanddips");
    const ratings = database.collection("gym_user");
    const cursor = await ratings.find({}).toArray()
    let latestData = JSON.parse(cursor);
    let cloneTableData = [...latestData];
    let index = cloneTableData.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
    if (index != -1){
        if (!deleteFlag) ratings.updateOne({"Reg No:": newUserData["Reg No:"]});
        else cloneTableData = cloneTableData.filter((val, indexNo) => indexNo !== index);
    }
    else {
        ratings.updateOne({"Reg No:": newUserData["Reg No:"]});
    }
}
router.post('/', function (req, res) {
    let { newUserData, deleteFlag} = req.body;
    updateMasterData(newUserData, deleteFlag);
	console.log(req.body);
	res.end();
})

router.get('/list', async (req, res) => {
    const database = client.db("rpesanddips");
    const ratings = database.collection("gym_user");
    const cursor = await ratings.find({}).toArray()
    res.send(cursor);
  })

  router.post('/backup', (req, res) => {
    const { updatefileName } =  req.body;
    res.send("updated Successfully"+ updatefileName);
    // fs.appendFile(`${updatefileName}.json`, JSON.stringify(file), function writeJSON(err) {
    //     if (err) return console.log(err);
    //     console.log('writing to ' + fileName);
    //     res.send("updated Successfully"+ updatefileName);
    //   });
})

// router.get('/checkinlist', (req, res) => {
//     fs.readFile(attendanceFileName, 'utf8', function(err, data){
//         if (err) return console.log(err);
//         res.send(data);
//         console.log(data);
//     });
//   })
  
  router.post('/checkin', async(req, res) => {
    const { newUserData } = req.body;
    // const database = client.db("rpesanddips");
    // const ratings = database.collection("gym_user");
    // const rawdata = await ratings.find({}).toArray()
    // let student = JSON.parse(rawdata);
    // let cloneTableData = [...student]
    // let index = cloneTableData.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
    // if (index != -1)
    //     cloneTableData[index] = newUserData;
    // else {
    //     cloneTableData.push(newUserData)
    // }
    updateMasterData(newUserData, false);
    // fs.writeFile(attendanceFileName, JSON.stringify(cloneTableData), function writeJSON(err) {
    //     if (err) return console.log(err);
    //     console.log('writing to ' + attendanceFileName);
    //     res.send("updated Successfully");
    // });
})

app.use("/.netlify/functions/api/", router);

module.exports.handler = serverless(app);
