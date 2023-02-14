const express = require("express");
const app = express();
// const errorHandler = require("errorHandler");
const path = require("path");
const port = 3000;

require("dotenv").config();

const prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

const initAPI = (req) => {
  return prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

const handleLinkResolver = (doc) => {
  return "/";
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver,
  };

  res.locals.PrismicDOM = PrismicDOM;

  next();
});

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
  initAPI(req).then((api) => {
    api
      .query([prismic.Predicates.any("document.type", ["metadata", "about"])])
      .then((response) => {
        const { results } = response;
        const [about, meta] = results;
        res.render("pages/about", {
          about,
          meta,
        });
      });
  });
});

app.get("/details/:uid", async (req, res) => {
  const api = await initAPI(req);
  const meta = await api.getSingle("metadata");
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });

  console.log(product);

  res.render("pages/details", {
    product,
    meta,
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
