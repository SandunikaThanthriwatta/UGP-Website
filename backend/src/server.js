import "dotenv/config";
import app from "./app.js";

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on  ${process.env.PORT || 3000} `);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
