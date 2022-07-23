const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("base", {
    meta: {
      data: {
        title: "Home",
        description: "Welcome to my website",
      },
    },
  });
});

app.get("/about", (req, res) => {
  res.render("pages/about", {
    meta: {
      data: {
        title: "About",
        description: "About me",
      },
    },
  });
});

app.get("/details/:id", (req, res) => {
  res.render("pages/details", {
    meta: {
      data: {
        title: "Contact",
        description: "Contact me",
      },
    },
  });
});

app.get("/collections/:id", (req, res) => {
  res.render("pages/collections", {
    meta: {
      data: {
        title: "Collection",
        description: "Collection of my products",
      },
    },
  });
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
