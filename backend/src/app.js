import express from "express";
import mongoose from "mongoose";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser";

import userRouter from "./api/router/user.js";
import adminRouter from "./api/router/admin.js";
import authRouter from "./api/router/auth.js";
import studentRouter from "./api/router/groups.js";
import path, { dirname} from "path";
import schema from "./graphql/schema.js";
import { logIn } from "./graphql/resolver.js";
import auth from "./middleware/auth.js";
import { fileURLToPath } from "url";
const app = express();

app.use(bodyParser.json());
// app.use(multer({ storage: storage }).single("file"));
app.use(cors());
app.use(auth);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log(req.file);
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded." });
//   }
//   const filePath = req.file.path;
//   console.log("File uploaded:", filePath);
//   res.json({ message: "File uploaded successfully." });
// });

app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/student", studentRouter);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: { logIn },
    graphiql: true,
    formatError(err) {
      if ((!err, originalError)) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || " An error occurred";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

mongoose
  .connect(
    // `mongodb+srv://oshanranasinghe25:hSOrF3nBZ3rQe9WJ@cluster0.txj0vpo.mongodb.net/?retryWrites=true&w=majority`
    'mongodb+srv://svenuranga:iamleVenu98%23@cluster0.n8pqomt.mongodb.net/UGP?retryWrites=true&w=majority'
    ,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Success"))
  .catch((err) => {
    console.log(err);
  });

export default app;
