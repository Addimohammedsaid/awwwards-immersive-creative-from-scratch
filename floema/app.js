const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", {
    meta: {
      data: {
        title: "Home",
        description: "Welcome to my website",
      },
    },
  });
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
