// YOUR_BASE_DIRECTORY/netlify/functions/api.ts
const express = require('express');
const serverless = require('serverless-http');
var cors = require('cors');
const fs = require('fs');
//const { MongoClient } = require("mongodb");
const mongoose = require('mongoose')
const Gym_user = require('./User');
let uri = `mongodb+srv://Pooprav:8igvJKHVlWNlhk5g@poopravcluster0.clos40k.mongodb.net/rpesanddips?retryWrites=true&w=majority&appName=poopravCluster0`;
mongoose.connect(uri).then(() => {
  console.log("connected");
})

const app = express();

const router = express.Router();
router.get("/hello", (req, res) => {
  const addNewRecord = new Gym_user({ "NAME": "Test" })
  addNewRecord.save().then((AddedData) => {
    res.send(AddedData)
  });
})

app.use(express.json());
app.use(cors())
const updateMasterData = async (newUserData, deleteFlag, res) => {
  await Gym_user.exists({ _id: newUserData['_id'] }).then((isExists) => {
    if (isExists === null) {
      Gym_user.create(newUserData).then((data) => {
        res.send(data);
      });
    } else {
      Gym_user.updateMany({ "Reg No:": newUserData["Reg No:"] }, newUserData).then((data) => {
        res.send(data);
      });
    }
  })
}
router.post('/', async function (req, res) {
  let { newUserData, deleteFlag } = req.body;
  await updateMasterData(newUserData, deleteFlag, res);
  //res.end();
})

router.get('/list', async (req, res) => {
  Gym_user.find().then((data) => {
    console.log(data)
    res.send(data);
  });

})

router.post('/backup', (req, res) => {
  const { updatefileName } = req.body;
  res.send("updated Successfully" + updatefileName);
})

router.get('/checkinlist', async (req, res) => {
  Gym_user.find().then((data) => {
    console.log(data)
    res.send(data);
  });
})

router.post('/checkin', async (req, res) => {
  const { newUserData } = req.body;
  await updateMasterData(newUserData, false, res);
  //res.send("updated Successfully");
})

app.use("/.netlify/functions/api/", router);

module.exports.handler = serverless(app);
