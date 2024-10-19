import { Router } from "express";
import {
  assignEvaluator,
  createEvaluator,
  getAllEvaluators,
  getUserDetails,
  userCreate,
} from "../controller/adminController.js";
import {
  getOneProject,
  getPorjectsByAdmin,
} from "../controller/projectsController.js";
import multer from "multer";

export const storage = multer.diskStorage({
  destination: "uploads/", // Updated destination path
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const router = Router();

router.post(
  "/user-register",
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ]),
  userCreate
);

router.get("/all-projects/:id", getPorjectsByAdmin);

router.get("/project/:id", getOneProject);
router.get("/admin/evaluated-groups")
router.get("/user-details/:id", getUserDetails);
router.get("/all-evaluators", getAllEvaluators);
router.post("/new-evaluator", createEvaluator);

router.post("/assign-evaluator", assignEvaluator);

export default router;
