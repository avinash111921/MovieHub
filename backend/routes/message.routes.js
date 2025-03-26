import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {getUserforSidebar,getMessage,sendMessage} from "../controllers/messageController.js"

const router = Router();

router.route("/sidebaruser").get(verifyJWT,getUserforSidebar);
router.route("/:id").get(verifyJWT,getMessage)
router.route("/send/:id").post(
    verifyJWT,
    upload.fields([
        {
            name: "messageImage",
            maxCount: 1
        },
    ]),
    sendMessage
)
export { router as messageRouter };