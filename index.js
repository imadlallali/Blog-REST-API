const express = require("express");
const app = express();
const postRoutes = require("./routes/postRoutes");
const port = 3000;

app.use(express.json());
app.use("/api", postRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
