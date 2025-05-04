import { Router } from "express";
import { VERSION } from "../config/env";
import { v1Routes } from "./v1";
import { redirectUrlSchema } from "../schemas/url";
import UrlController from "../controllers/url";

const routes: Router = Router();

routes.use(VERSION.v1, v1Routes);

routes.get("/:url_path", redirectUrlSchema, UrlController.redirectToOriginalUrl);

export { routes };
