require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const errorHandler = require("errorhandler");
const logger = require("morgan");

const app = express();
const path = require("path");
const port = 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(errorHandler());
app.use((req, res, next) => {
  // res.locals.ctx = {
  //   endpoint: process.env.PRISMIC_ENDPOINT,
  //   linkResolver: handleLinkResolver,
  // };
  res.locals.PrismicDOM = PrismicDOM;
  res.locals.labels = ["one", "two", "three", "four"];
  res.locals.Link = handleLinkResolver;
  next();
});

const prismic = require("@prismicio/client");
const PrismicDOM = require("prismic-dom");

const initAPI = (req) => {
  return prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
  });
};

const handleLinkResolver = (doc) => {
  if (doc.link.type === "product") {
    return `/detail/${doc.link.slug}`;
  }
  if (doc.link.type === "about") {
    return `/about/`;
  }
  if (doc.link.type === "collections") {
    return `/collections/`;
  }
  return "/";
};

const handleRequest = async (api) => {
  const meta = await api.getSingle("metadata");
  const preloader = await api.getSingle("preloader");
  const navigation = await api.getSingle("navigation");

  return {
    meta,
    navigation,
    preloader,
  };
};

app.get("/", async (req, res) => {
  const api = await initAPI(req);
  const defaults = await handleRequest(api);
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
    ...defaults,
  });
});

app.get("/about", async (req, res) => {
  const api = await initAPI(req);
  const defaults = handleRequest(api);
  const about = await api.getSingle("about");
  res.render("pages/about", {
    about,
    ...defaults,
  });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initAPI(req);
  const defaults = await handleRequest(api);
  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });
  res.render("pages/detail", {
    product,
    ...defaults,
  });
});

app.get("/collections", async (req, res) => {
  const api = await initAPI(req);
  const defaults = await handleRequest(api);
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
    ...defaults,
  });
});

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
