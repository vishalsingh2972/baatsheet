import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { FormRoutes } from "../modules/form/form.route";
import { ResponseRoutes } from "../modules/response/response.route";
import { AiRoutes } from "../modules/ai/ai.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/forms",
    route: FormRoutes,
  },
  {
    path: "/forms",
    route: ResponseRoutes,
  },
  {
    path: "/ai",
    route: AiRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
