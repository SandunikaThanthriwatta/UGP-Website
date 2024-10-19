import { Router } from "express";
import {
    editProject,
  getOneProject,
  getPorjectsByAdmin,
  getProjectByStudent,
  getPorjectsByEvaluator,
  studentEvaluate,
  groupEvaluate,
  finalizeEvaluations,
  graphData
} from "../controller/projectsController.js";

const router = Router();

router.get("/project/:id", getOneProject);
router.get("/my-project/:id", getProjectByStudent);
router.put("/project-update/:id", editProject );
router.post('/individual-marks', studentEvaluate)
router.post('/group-marks', groupEvaluate)
router.get('/evaluator-projects/:id',getPorjectsByEvaluator)
router.post('/finalize-marks', finalizeEvaluations)
router.get('/chart-marks/:id', graphData)
export default router;
