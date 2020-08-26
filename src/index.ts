import { createService } from "@propero/easy-api";
import express from "express";
import bodyParser from "body-parser";
import { connect } from "src/connection";
import * as Services from "src/services";

connect().then(() => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  for (const service of Object.values(Services)) app.use("/", createService(new service()));
  app.listen(3000, () => console.log("http://localhost:3000/"));
});
