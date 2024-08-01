// YOUR_BASE_DIRECTORY/netlify/functions/api.ts
const express = require('express');
const serverless = require('serverless-http');
var cors = require('cors');
const fs = require('fs');
const Datefs = require( 'date-fns');
//const { MongoClient } = require("mongodb");
const mongoose = require('mongoose')
const Gym_user = require('./User');
const User_list = require('./neelamUsers');
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
});

router.post("/add_new_neelam_user", async (req, res) => {
  const { newUserData = {} } = req.body;
  const addNewRecord =  new User_list(newUserData)
  addNewRecord.save().then((AddedData) => {
    res.send(AddedData)
  });
})

router.get("/neelam_user_list", async (req, res) => {
  User_list.find().then((data) => {
    console.log(data)
    res.send(data);
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
});


router.get('/list', async (req, res) => {
  Gym_user.find().then((data) => {
    console.log(data)
    res.send(data);
  });

})

const sendSms = (phone, message) => {
  const client = require('twilio')('AC2b16ddcdf714b00e3e51a9d8aba91cad', '17a6938ddfe2086fbef414a5e7f3f772');
  client.messages
    .create({
       body: message,
       from: "+18622596384",
       to: phone
     })
    .then(message => console.log(message.sid));
}
router.get('/backup', (req, res) => {
  let defaultListData = []; 
  Gym_user.find().then((data) => {
    data.forEach((row, index) => {
      let date1 = new Date(row["DUE DATE"]) 
      if (!row["DUE DATE"]) {
        row["DUE DATE"] = Datefs.add(new Date(row["lastUpdateDateTime"]), {
          months: row["Fees Options"]
        }).valueOf();
        date1 = new Date(row["DUE DATE"])
      }
      const date2 = new Date();
      const daysDiff = Datefs.differenceInDays(
        new Date(date1),
        new Date(date2)
      )
      const rowColor = isNaN(daysDiff) || daysDiff < -90 ?  "#f0f0b7" : (daysDiff >= -90 && daysDiff <= 0) ?  "#f47979" : "#2afc0094";
      //const rowColor = isNaN(date2 - date1) || (date2 - date1 > 0 && diffDays > 90) ? "#f0f0b7" : (date2 - date1) > 0 ? "#f47979" : "#2afc0094";
      data[index] = {
        ...data[index]['_doc'],
        expiredDays: Math.abs(daysDiff),
        rowColor,
        inValidList: rowColor === "#f0f0b7"
      }
      if (rowColor === "#f47979") {
        console.log(data[index])
        defaultListData.push({registerNo: data[index]["Reg No:"], phoneNo:  '+91'+data[index]["Phone Number"], message: `Hi ${data[index]["NAME"]} your Reps & Dips subscription package already expired since ${data[index]["expiredDays"]} You suppose to pay on ${Datefs.format(new Date(data[index]["DUE DATE"]), 'dd/MM/yyyy')},Your Register No : ${data[index]["Reg No:"]}` })
      };
    });
     let registerNumberList = ''
    if(defaultListData.length){
    //   defaultListData.map(({registerNo, phoneNo, message})=>{
    //     registerNumberList += `${registerNo}, `
    //    // sendSms(phoneNo, message)
    // })
    }
    sendSms(["+919841237582", "+6584172895"], `${defaultListData[0].message}, Total Not paid Number ${defaultListData.length}--> ${registerNumberList}`)
    res.send(defaultListData);
  });
  //const { updatefileName } = req.body;
  
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
