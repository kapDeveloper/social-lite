import { Router } from "express";
import {
  deletePosts,
  editPosts,
  getPosts,
  sendPosts,
  getEditPost,
} from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/send-posts").post(
  upload.fields([
    {
      name: "img",
      maxCount: 1,
    },
  ]),
  sendPosts
);

router.route("/edit-posts/:id").put(upload.single("img"), editPosts);

router.route("/delete-posts/:id").delete(deletePosts);

router.route("/get-edit-post/:id").get(getEditPost);

router.route("/get-posts").get(getPosts);
export default router;
