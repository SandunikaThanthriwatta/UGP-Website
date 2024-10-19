import csv from "csv-parser";
import fs from "fs";
import Groups from "../../models/groups.js";
import Students from "../../models/students.js";
import Users from "../../models/users.js";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import Evaluators from "../../models/evaluators.js";

export const userCreate = async (req, res, next) => {
  const year = req.header("acaYear");
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  const file1 = req.files["file1"][0];
  const file2 = req.files["file2"][0];

  const filePath_1 = file1.path;
  const filrPath_2 = file2.path;

  const profile = [];
  const criteriaData = [];
  const marksSchea = {
    proposal: [],

    progress: [],

    final: [],
  };
  const studentsByGroup = {};
  const projectEvaluationScore = {
    Proposal: null,
    progress: null,
    final: null,
  };

  fs.createReadStream(filrPath_2)
    .pipe(csv())
    .on("data", (row) => {
      const { section, criteria, sub_criteria, marks_resaved, marks } = row;
      if (section === "proposal") {
        marksSchea.proposal.push({
          criteria,
          sub_criteria,
          marks_resaved,
          marks,
        });
      }
      if (section === "progress") {
        marksSchea.progress.push({
          criteria,
          sub_criteria,
          marks_resaved,
          marks,
        });
      }
      if (section === "final") {
        marksSchea.final.push({ criteria, sub_criteria, marks_resaved, marks });
      }
    })
    .on("end", () => {});

  fs.createReadStream(filePath_1)
    .pipe(csv())
    .on("data", (row) => {
      const groupID = row.Group_ID;
      if (!studentsByGroup[groupID]) {
        studentsByGroup[groupID] = {
          groupID: row.Group_ID,
          projectTitle: row.Project_Title,
          mainSupervisor: row.Main_supervisor_name,
          students: [],
        };
      }
      profile.push({
        studentId: row.Reg_No,
        name: row.Name,
        groupID: row.Group_ID,
      });
      studentsByGroup[groupID].students.push({
        studentId: row.Reg_No,
        groupID: row.Group_ID,
        studentMarks: "",
        name: row.Name,
        regNo: row.Reg_No,
      });
    })
    .on("end", async () => {
      try {
        console.log(marksSchea);
        const createUsers = await Users.insertMany(
          profile.map((p) => ({
            userId: p.studentId,
            userName: p.name,
            userType: 0,
            password: p.studentId,
          }))
        );
        const createStudent = await Students.insertMany(
          profile.map((p) => ({
            studentId: p.studentId,
            studentName: p.name,
            groupId: p.groupID,
          }))
        );
        const createGroups = await Groups.insertMany(
          Object.values(studentsByGroup).map((p) => ({
            groupId: p.groupID,
            evaluationYear: year,
            projectName: p.projectTitle,
            mainSupervisor: p.mainSupervisor,
            groupMembers: p.students,
            projectEvaluationScore: marksSchea,
          }))
        );
        return res.json({ createGroups, createUsers, createStudent });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          message: "an error occurred",
          error: err,
        });
      }
    });
};

export const userDelete = async (req, res, next) => {};

export const getUserDetails = async (req, res, next) => {
  // const id = req.params.id;
  const header = req.header("userId");

  const user = await Users.findOne({ userId: header });

  try {
    if (!user) throw new Error("invalid user Id");

    const type = user.userType;
    const userId = user.userId;
    let userData;
    console.log(user);

    if (type === 0) {
      userData = await Students.findOne({ studentId: userId });

      if (!userData) throw new Error("User not Found");

      res.status(200).send(userData);
    } else if (type === 1) {
      // userData = await Students.findOne(userId == studentId)
      // if(!userData) throw new Error("User nfot Found");
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const createEvaluator = async (req, res, next) => {
  const data = req.body.userData;
  const existEvaluator = await Evaluators.findOne({
    evaluatorId: data.evaluatorId,
  });

  try {
    if (existEvaluator) throw new Error("Evaluator Exist");

    const newUser = new Users({
      userId: data.evaluatorId,
      password: data.evaluatorPassword,
      userType: 1,
      userName: data.evaluatorName,
    });
    const newUserDetails = await newUser.save();

    const newEvaluator = new Evaluators({
      evaluatorId: data.evaluatorId,
      evaluatorName: data.evaluatorName,
      department: data.department,
      email: data.evaluatorEmail,
      userId: newUserDetails._id,
    });
    await newEvaluator.save();

    return res.status(200).send("New Evaluator created");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.messsage,
    });
  }
};

export const assignEvaluator = async (req, res, next) => {
  const { groupId, evaluatorId } = req.body.userData;

  try {
    const existGroup = await Groups.findOne({ groupId: groupId });
    if (!existGroup) throw new Error("Invalid group Id");

    const existEvaluator = await Evaluators.findById(evaluatorId);
    if (!existEvaluator) throw new Error("Invalid evaluator Id");

    existGroup.evaluator.push(evaluatorId);
    await existGroup.save();
    return res.status(200).send("evaluator added");
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getAllEvaluators = async (req, res, next) => {
  const evaluators = await Evaluators.find();
  res.status(200).json({
    evaluators: evaluators,
  });
};

export const getEvaluationScores = async (req, res, next) => {
  const year = req.params.id;

  const projects = await Groups.find({ evaluationYear: year });
  

};
