import Evaluators from "../../models/evaluators.js";
import Groups from "../../models/groups.js";
import Students from "../../models/students.js";
import Users from "../../models/users.js";

export const getPorjectsByAdmin = async (req, res, next) => {
  const year = req.params.id;
  let projects;
  if (!year) {
    projects = await Groups.find()
      .populate("evaluator")
      .sort({ createdAt: -1 });
  } else {
    projects = await Groups.find({ evaluationYear: year }).populate(
      "evaluator"
    );
  }

  try {
    if (!projects) throw new Error("NO Projects found");

    res.status(200).send({
      projects: projects,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getPorjectsByEvaluator = async (req, res, next) => {
  const id = req.params.id;
  const year = req.header("acadamicYear");
  try {
    const evaluator = await Evaluators.findOne({ userId: id });
    if (!evaluator) throw new Error("Invalid user Id");

    const projects = await Groups.find({
      evaluator: evaluator._id,
      evaluationYear: year,
    }).populate("evaluator");
    console.log(projects, id);

    if (!projects) throw new Error("NO Projects found");

    res.status(200).send({
      projects: projects,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getOneProject = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (id === ":id") throw new Error("invalid ID");
    const project = await Groups.findById(id);
    if (!project) throw new Error("Invalid Project Id");

    return res.status(200).json({
      project: project,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const getProjectByStudent = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const user = await Users.findById(id);

  try {
    if (!user) throw new Error("invalid user Id");
    const student = await Students.findOne({ studentId: user.userId });
    console.log(student);

    if (!student) throw new Error("No STUDENT Under this reg no");
    const project = await Groups.findOne({ groupId: student.groupId });
    if (!project) throw new Error("No Project Under this reg no");

    return res.status(200).json({
      project: project,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const editProject = async (req, res, next) => {
  const id = req.params.id;
  const projectData = req.body;
  const student = await Students.findOne({ studentId: projectData.studentId });
  const project = await Groups.findById(id);

  let submitData = { projectDescription: null, projectImages: null };
  try {
    if (projectData.projectDescription === "<p><br></p>") {
      submitData.projectDescription = project.projectDescription;
    }
    if (projectData.projectImages === "h") {
      submitData.projectDescription = projectData.projectDescription;
      submitData.projectImages = project.projectImages;
    } else {
      submitData = projectData;
    }

    const projectSub = await Groups.findByIdAndUpdate(
      id,
      { $set: submitData },
      { new: true }
    );
    await projectSub.save();

    return res.status(200).json({
      project: project,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const groupEvaluate = async (req, res, next) => {
  const { id, marks } = req.body;
  try {
    const project = await Groups.findById(id);
    if (!project) throw new Error("invalid project id");
    const sizeProject = project.projectEvaluationScore.proposal.length;
    const sizeProgress = project.projectEvaluationScore.progress.length;
    const sizefinal = project.projectEvaluationScore.final.length;

    const result = {};

    // Iterate through the keys in the object
    for (const key in marks) {
      if (marks.hasOwnProperty(key)) {
        const [type, index] = key.split("_");

        if (type && index) {
          if (!result[type]) {
            result[type] = {};
          }
          result[type][index] = marks[key];
        }
      }
    }

    for (let i = 0; i < sizeProject; i++) {
      let marksFiled = `projectEvaluationScore.proposal.${i}.marks`;
      let marks = "";

      if (!result.proposal) {
        marks = project.projectEvaluationScore.proposal[i].marks;
      } else {
        marks = result.proposal[i];
      }

      const updatedProject = await Groups.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            [marksFiled]: marks,
          },
        },
        { new: true }
      );
      await updatedProject.save();
    }

    for (let i = 0; i < sizeProgress; i++) {
      let marksFiled = `projectEvaluationScore.progress.${i}.marks`;
      let marks = "";
      if (!result.progress) {
        marks = project.projectEvaluationScore.progress[i].marks;
      } else {
        marks = result.progress[i];
      }

      const updatedProject = await Groups.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            [marksFiled]: marks,
          },
        },
        { new: true }
      );
      await updatedProject.save();
    }
    for (let i = 0; i < sizefinal; i++) {
      let marksFiled = `projectEvaluationScore.final.${i}.marks`;

      let marks = "";
      if (!result.final) {
        marks = project.projectEvaluationScore.final[i].marks;
      } else {
        marks = result.final[i];
      }

      const updatedProject = await Groups.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            [marksFiled]: marks,
          },
        },
        { new: true }
      );
      await updatedProject.save();
    }
    await project.save();

    // const update = await project.save();
    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const studentEvaluate = async (req, res, next) => {
  const { id, studentMarks, criteria, groupId } = req.body.userData;
  try {
    const updatedProject = await Groups.findOneAndUpdate(
      { "groupMembers.studentId": id },
      { $set: { "groupMembers.$.studentMarks": studentMarks } },
      { new: true }
    );
    const user = await Groups.findOne({ "groupMembers.studentId": id });
    // await updatedProject.save();
    const student = user.groupMembers.findIndex((p) => p.studentId === id);
    const onsStudent = user.groupMembers[student];
    if (onsStudent.evaluationAreas !== 0) {
      const criIndex = onsStudent.evaluationAreas.findIndex(
        (q) => q.criteria === criteria
      );
      console.log(criIndex, studentMarks);
      if (criIndex == -1) {
        user.groupMembers.studentFinalMarks += studentMarks;
        onsStudent.evaluationAreas.push({
          criteria: criteria,
          studentMarks: studentMarks,
        });
      } else {
        user.groupMembers.studentFinalMarks -=
          onsStudent.evaluationAreas[criIndex].studentMarks;
        onsStudent.evaluationAreas[criIndex].studentMarks = studentMarks;
        user.groupMembers.studentFinalMarks += studentMarks;
      }
    }

    await user.save();
    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const finalizeEvaluations = async (req, res, next) => {
  const academicYear = req.body.searchYear;

  try {
    const allGroups = await Groups.find({ evaluationYear: academicYear });
    if (!allGroups) throw new Error("invalid Evaluation Year");
    const proposal = allGroups[0].projectEvaluationScore.proposal.length;
    const progress = allGroups[0].projectEvaluationScore.progress.length;
    const final = allGroups[0].projectEvaluationScore.final.length;
    let proposalMarks = 0;
    let progressMarks = 0;
    let final_Marks = 0;

    let proposalTotal = 0;
    let progressTotal = 0;
    let finalTotal = 0;

    for (let i = 0; i < proposal; i++) {
      proposalTotal += parseInt(
        allGroups[0].projectEvaluationScore.proposal[i].marks_resaved
      );
    }
    for (let i = 0; i < progress; i++) {
      progressTotal += parseInt(
        allGroups[0].projectEvaluationScore.progress[i].marks_resaved
      );
    }
    for (let i = 0; i < final; i++) {
      finalTotal += parseInt(
        allGroups[0].projectEvaluationScore.final[i].marks_resaved
      );
    }

    for (let j = 0; j < allGroups.length; j++) {
      let id = allGroups[j]._id;

      for (let i = 0; i < proposal; i++) {
        const containsIndividual =
          allGroups[j].projectEvaluationScore.proposal[i].criteria
            .toLowerCase()
            .includes("individual") ||
          (allGroups[j].projectEvaluationScore.proposal[i].sub_criteria &&
            allGroups[j].projectEvaluationScore.proposal[i].sub_criteria
              .toLowerCase()
              .includes("individual"));

        if (
          allGroups[j].projectEvaluationScore.proposal[i].marks === "0" &&
          containsIndividual
        ) {
          throw new Error("evaluations are not completed");
        }
        proposalMarks += parseFloat(
          allGroups[j].projectEvaluationScore.proposal[i].marks
        );
        console.log(proposalMarks);
      }
      for (let i = 0; i < progress; i++) {
        const containsIndividual =
          allGroups[j].projectEvaluationScore.progress[i].criteria
            .toLowerCase()
            .includes("individual") ||
          (allGroups[j].projectEvaluationScore.progress[i].sub_criteria &&
            allGroups[j].projectEvaluationScore.progress[i].sub_criteria
              .toLowerCase()
              .includes("individual"));

        if (
          allGroups[j].projectEvaluationScore.progress[i].marks === "0" &&
          containsIndividual
        ) {
          throw new Error("evaluations are not completed");
        }
        progressMarks += parseFloat(
          allGroups[j].projectEvaluationScore.progress[i].marks
        );
      }
      for (let i = 0; i < final; i++) {
        const containsIndividual =
          allGroups[j].projectEvaluationScore.final[i].criteria
            .toLowerCase()
            .includes("individual") ||
          (allGroups[j].projectEvaluationScore.final[i].sub_criteria &&
            allGroups[j].projectEvaluationScore.final[i].sub_criteria
              .toLowerCase()
              .includes("individual"));

        if (
          allGroups[j].projectEvaluationScore.final[i].marks === "0" &&
          containsIndividual
        ) {
          throw new Error("evaluations are not completed");
        }
        final_Marks += parseFloat(
          allGroups[j].projectEvaluationScore.final[i].marks
        );
      }
      const finalMarks = {
        proposal: proposalMarks.toString(),
        progress: progressMarks.toString(),
        final: final_Marks.toString(),
      };

      const update = await Groups.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            finalMarks: finalMarks,
            evaluationFinalized: true,
          },
        }
      );

      await update.save();
      proposalMarks = 0;
      progressMarks = 0;
      final_Marks = 0;
    }

    return res.status(200).send("ok");
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const graphData = async (req, res, next) => {
  const academicYear = req.params.id;
  const groupIds = [];
  const proposal_marks = [];
  const progress_marks = [];
  const final_Mrks = [];

  try {
    const allGroups = await Groups.find({ evaluationYear: academicYear });

    const proposal = allGroups[0].projectEvaluationScore.proposal.length;
    const progress = allGroups[0].projectEvaluationScore.progress.length;
    const final = allGroups[0].projectEvaluationScore.final.length;

    let proposalMarks = 0;
    let progressMarks = 0;
    let final_Marks = 0;

    for (let j = 0; j < allGroups.length; j++) {
      groupIds.push(allGroups[j].groupId);

      let id = allGroups[j]._id;
      for (let i = 0; i < proposal; i++) {
        proposal_marks.push(parseFloat(allGroups[j].finalMarks.proposal));
        proposalMarks += parseFloat(allGroups[j].finalMarks.proposal);
      }
      for (let i = 0; i < progress; i++) {
        progress_marks.push(parseFloat(allGroups[j].finalMarks.progress));
        progressMarks += parseFloat(allGroups[j].finalMarks.progress);
      }
      for (let i = 0; i < final; i++) {
        final_Mrks.push(parseFloat(allGroups[j].finalMarks.final));
        final_Marks += parseFloat(allGroups[j].finalMarks.final);
      }
    }

    return res.status(200).json({
      proposal_marks,
      progress_marks,
      final_Mrks,
      groupIds,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};
