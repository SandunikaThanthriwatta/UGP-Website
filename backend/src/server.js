import "dotenv/config";
import app from "./app.js";

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on  ${process.env.PORT || 3000} `);
});
