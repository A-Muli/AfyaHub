const { request } = require("express");
const { DoctorModel } = require("../models/doctor.model");
const doctorRouter = require("express").Router();

// doctorRouter.get("/doctorRouter", (req, res) => {
//   res.send("On Doctor Route ");
// });

doctorRouter.post("/addDoctor", async (req, res) => {
  let {
    doctorName,
    email,
    qualifications,
    experience,
    phoneNo,
    city,
    departmentId,
    status,
    image,
  } = req.body;
  try {
    let doctor = await DoctorModel({
      doctorName,
      email,
      qualifications,
      experience,
      phoneNo,
      city,
      departmentId,
      status,
      image,
    });
    await doctor.save();
    res.status(201).send({ msg: "Doctor has been created", doctor });
  } catch (error) {
    res.status(500).send({ msg: "Error in created doctor" });
  }
});

// get all
doctorRouter.get("/allDoctor", async (req, res) => {
  try {
    let doctor = await DoctorModel.find();
    res.status(201).send({ total: doctor.length, doctor });
  } catch (error) {
    res.status(500).send({ msg: "Error in getting dr info.." });
  }
});

// DOCTORS BY DEPARTMENT 
doctorRouter.get("/allDoctor/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let doctor = await DoctorModel.find({departmentId:id});
    res.status(201).send({ total: doctor.length, doctor });
  } catch (error) {
    res.status(500).send({ msg: "Error in getting dr info.." });
  }
});

// DELETE A DOCTOR..
doctorRouter.delete("/removeDoctor/:id", async (req, res) => {
  let id = req.params.id;
  let isDoctorPresent = await DoctorModel.findById({ _id: id });
  try {
    if (!isDoctorPresent) {
      return res.status(500).send({ msg: "Doctor not found" });
    }

    let doctor = await DoctorModel.findByIdAndDelete({ _id: id })
      .then(() => {
        res.status(201).send({ msg: "Doctor deleted" });
      })
      .catch(() => {
        res.status(500).send({ msg: "Error in deleting the doctor" });
        console.log("Error deleting the doctor");
      });
  } catch (error) {
    res.status(500).send({ msg: "Error in deleting the doctor" });
  }
});

// UPDATE THE DOCTOR..
doctorRouter.patch("/udateDoctorInfo/:id", async (req, res) => {
  let id = req.params.id;

  let isDoctorPresent = await DoctorModel.findById({ _id: id });
  if (!isDoctorPresent) {
    return res.status(404).send({ msg: "Doctor not found" });
  }
  if(req.body===true){
    let payload = {
      ...isDoctorPresent._doc,
    };
    payload.status = true;
  }else{
    return res.status(201).send({msg:'Doctor Application Rejected'})
  }
  try {
    let doctor = await DoctorModel.findByIdAndUpdate({ _id: id }, payload)
      .then(() => {
        res.status(201).send({ msg: "Doctor Application Approved" });
      })
      .catch(() => {
        res.status(500).send({ msg: "Error in Updating the doctor info.." });
        
      });
  } catch (error) {
    res
      .status(500)
      .send({ msg: "Server error while updating the doctor info.." });
  }
});

module.exports = {
  doctorRouter,
};

// DOCTORS DATA...
// {
//     "doctorName":"Abhishek Jaiswal",
//     "email":"abhisek@gmail.com",
//     "qualification":"MBBS from AIMS Delhi",
//     "experience":"14 years of experience",
//     "phoneNo":"7011144555",
//     "city":"Mumbai",
//     "departmentId":1,
//     "status":true,
//     "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJO1Bmu2stkBmmOJXmyHN5G7UHmeA4xr5z0whR9JZF&s"
// }

// doctors