require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const errorHandler = require("errorhandler");
const logger = require("morgan");

const app = express();
const path = require("path");
const port = 3000;

const prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());

const initAPI = (req) => {
  return prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

const handleLinkResolver = (doc) => {
  if (doc.type === "product") {
    return `/detail/${doc.slug}`;
  }
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
  res.locals.labels = ["one", "two", "three", "four"];
  res.locals.Link = handleLinkResolver;
  next();
});

app.get("/", async (req, res) => {
  const api = await initAPI(req);
  const meta = await api.getSingle("metadata");
  const preloader = await api.getSingle("preloader");
  const home = await api.getSingle("home");
  const { results: collections } = await api.query(
    prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );
  res.render("pages/home", {
    collections,
    home,
    meta,
    preloader,
  });
});

app.get("/about", async (req, res) => {
  const api = await initAPI(req);
  const meta = await api.getSingle("metadata");
  const preloader = await api.getSingle("preloader");
  const about = await api.getSingle("about");
  res.render("pages/about", {
    about,
    meta,
    preloader,
  });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initAPI(req);
  const meta = await api.getSingle("metadata");
  const preloader = await api.getSingle("preloader");
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });
  res.render("pages/detail", {
    product,
    preloader,
    meta,
  });
});

app.get("/collections", async (req, res) => {
  const api = await initAPI(req);
  const meta = await api.getSingle("metadata");
  const preloader = await api.getSingle("preloader");
  const home = await api.getSingle("home");
  const { results: collections } = await api.query(
    prismic.Predicates.at("document.type", "collection"),
    {
      fetchLinks: "product.image",
    }
  );
  res.render("pages/collections", {
    collections,
    home,
    meta,
    preloader,
  });
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
