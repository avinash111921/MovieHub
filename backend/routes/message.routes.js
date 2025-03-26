import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {getUserforSidebar,getMessage,sendMessage} from "../controllers/messageController.js"

const router = Router();

router.route("/sidebaruser").get(verifyJWT,getUserforSidebar);
router.route("/:id").get(verifyJWT,getMessage)
router.route("/send/:id").post(
    verifyJWT,
    upload.array("messageImage",5),  //allow up to 5 messages
    sendMessage
)
export { router as messageRouter };