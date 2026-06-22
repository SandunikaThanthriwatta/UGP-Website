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
  console.log("[evaluator-projects] userId param:", id, "| year:", year);
  try {
    const loginUser = await Users.findById(id);
    const evaluator = await Evaluators.findOne({
      $or: [
        { userId: id },
        ...(loginUser?.userId ? [{ evaluatorId: loginUser.userId }] : []),
      ],
    });
    console.log("[evaluator-projects] evaluator found:", evaluator?._id ?? "NOT FOUND");
    if (!evaluator) {
      console.log("[evaluator-projects] no evaluator record for user", id);
      return res.status(200).send({ projects: [] });
    }

    const query = year
      ? { evaluator: evaluator._id, evaluationYear: year }
      : { evaluator: evaluator._id };

    const [projects, studentDocs] = await Promise.all([
      Groups.find(query).populate("evaluator"),
      Students.find({}, { studentId: 1, studentName: 1 }),
    ]);

    if (!projects) throw new Error("NO Projects found");

    const nameMap = {};
    studentDocs.forEach((s) => { if (s.studentId) nameMap[s.studentId] = s.studentName; });

    const enriched = projects.map((p) => {
      const obj = p.toObject();
      obj.groupMembers = (obj.groupMembers || []).map((m) => ({
        ...m,
        name: m.name || nameMap[m.studentId] || "",
      }));
      return obj;
    });

    console.log("[evaluator-projects] projects found:", enriched.length);
    res.status(200).send({ projects: enriched });
  } catch (err) {
    console.log("[evaluator-projects] ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getOneProject = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (id === ":id") throw new Error("invalid ID");
    const [project, studentDocs] = await Promise.all([
      Groups.findById(id).populate("evaluator"),
      Students.find({}, { studentId: 1, studentName: 1 }),
    ]);
    if (!project) throw new Error("Invalid Project Id");

    const nameMap = {};
    studentDocs.forEach((s) => { if (s.studentId) nameMap[s.studentId] = s.studentName; });

    const obj = project.toObject();
    obj.groupMembers = (obj.groupMembers || []).map((m) => ({
      ...m,
      name: m.name || nameMap[m.studentId] || "",
    }));

    return res.status(200).json({ project: obj });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getProjectByStudent = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await Users.findById(id);
    if (!user) throw new Error("invalid user Id");

    const project = await Groups.findOne({ "groupMembers.studentId": user.userId });
    if (!project) throw new Error("No Project Under this reg no");

    return res.status(200).json({ project });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const removeProjectImage = async (req, res, next) => {
  const { id } = req.params;
  const { imageUrl } = req.body;
  try {
    const updated = await Groups.findByIdAndUpdate(
      id,
      { $pull: { projectImages: imageUrl } },
      { new: true }
    );
    return res.status(200).json({ project: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const editProject = async (req, res, next) => {
  const id = req.params.id;
  const { projectDescription, projectImages } = req.body;

  try {
    const project = await Groups.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const updateFields = {};

    if (projectDescription && projectDescription !== "<p><br></p>") {
      updateFields.projectDescription = projectDescription;
    }

    const newImages = Array.isArray(projectImages) ? projectImages.filter(Boolean) : [];
    if (newImages.length > 0) {
      const existing = Array.isArray(project.projectImages) ? project.projectImages : [];
      updateFields.projectImages = [...existing, ...newImages];
    }

    const updated = await Groups.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).populate("evaluator");

    return res.status(200).json({ project: updated });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
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
    const group = await Groups.findOne({ "groupMembers.studentId": id });
    if (!group) throw new Error("Group not found for student " + id);

    const member = group.groupMembers.find((m) => m.studentId === id);
    const criIndex = (member?.evaluationAreas || []).findIndex((a) => a.criteria === criteria);

    if (criIndex === -1) {
      await Groups.findOneAndUpdate(
        { "groupMembers.studentId": id },
        { $push: { "groupMembers.$[m].evaluationAreas": { criteria, studentMarks } } },
        { arrayFilters: [{ "m.studentId": id }] }
      );
    } else {
      await Groups.findOneAndUpdate(
        { "groupMembers.studentId": id },
        { $set: { [`groupMembers.$[m].evaluationAreas.${criIndex}.studentMarks`]: studentMarks } },
        { arrayFilters: [{ "m.studentId": id }] }
      );
    }

    return res.status(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const finalizeEvaluations = async (req, res, next) => {
  const academicYear = req.body.searchYear;

  const isIndividual = (item) =>
    item.criteria?.toLowerCase().includes("individual") ||
    (item.sub_criteria && item.sub_criteria.toLowerCase().includes("individual"));

  try {
    const allGroups = await Groups.find({ evaluationYear: academicYear });
    if (!allGroups || allGroups.length === 0) throw new Error("No groups found for this year");

    for (const group of allGroups) {
      const allCriteria = [
        ...group.projectEvaluationScore.proposal,
        ...group.projectEvaluationScore.progress,
        ...group.projectEvaluationScore.final,
      ];

      // Validate group-level criteria are filled
      for (const item of allCriteria) {
        if (!isIndividual(item) && (!item.marks || item.marks === "0")) {
          throw new Error(`Group marks not completed: "${item.criteria}" in group ${group.groupId}`);
        }
      }

      // Validate each student has marks for every individual criterion
      const individualCriteria = allCriteria.filter(isIndividual);
      for (const member of group.groupMembers) {
        for (const criterion of individualCriteria) {
          const found = (member.evaluationAreas || []).find((a) => a.criteria === criterion.criteria);
          if (!found) {
            throw new Error(`Individual marks missing for ${member.studentId}: "${criterion.criteria}" in group ${group.groupId}`);
          }
        }
      }

      // Sum of all group-level criteria marks (same for every student in the group)
      const groupTotal = allCriteria
        .filter((item) => !isIndividual(item))
        .reduce((sum, item) => sum + parseFloat(item.marks || 0), 0);

      // Per-student total = shared group total + their own individual marks
      const updatedMembers = group.groupMembers.map((member) => {
        const obj = member.toObject();
        const individualTotal = (member.evaluationAreas || [])
          .reduce((sum, area) => sum + parseFloat(area.studentMarks || 0), 0);
        obj.studentFinalMarks = groupTotal + individualTotal;
        return obj;
      });

      await Groups.findByIdAndUpdate(
        group._id,
        { $set: { groupMembers: updatedMembers, evaluationFinalized: true } }
      );
    }

    return res.status(200).send("ok");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

export const graphData = async (req, res, next) => {
  const academicYear = req.params.id;

  try {
    const allGroups = await Groups.find({ evaluationYear: academicYear, evaluationFinalized: true });

    const groupIds = [];
    const studentMarks = [];   // average studentFinalMarks per group

    for (const group of allGroups) {
      groupIds.push(group.groupId);
      const members = group.groupMembers || [];
      const avg = members.length > 0
        ? members.reduce((sum, m) => sum + (parseFloat(m.studentFinalMarks) || 0), 0) / members.length
        : 0;
      studentMarks.push(parseFloat(avg.toFixed(2)));
    }

    return res.status(200).json({ groupIds, studentMarks });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
