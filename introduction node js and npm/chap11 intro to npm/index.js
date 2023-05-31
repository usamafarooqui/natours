const http = require("http");
const fs = require("fs");
const url = require("url");

// lets install slugify npm i slugify
const slugify = require("slugify"); //  slugify/slugify: Small utility library for generating speaking URLs

// example
console.log(slugify("Usna shsjHSHS", { lower: true }));

const replaceTemplate = require("./module/replaceTemplate");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "content-type": "text/html" });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
    res.end(output);
  }

  // product
  else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // api
  else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });

    res.end(data);
  }

  // not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own": "hello world",
    });
    res.end("<h1>No page found</h1>");
  }

  console.log(req.url);
});

server.listen(8000, () => {
  console.log("lsitening to request on port 8000");
});
