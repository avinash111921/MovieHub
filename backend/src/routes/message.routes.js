import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {getUserforSidebar,getMessage,sendMessage} from "../controllers/messageController.js"

const router = Router();

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
router.route("/users").get(verifyJWT,getUserforSidebar);
router.route("/:id").get(verifyJWT,getMessage)
export { router as messageRouter };


/* getUser -> 
{
    "message": "succesFully get LoggedIn User",
    "statusCode": 200,
    "data": [
        {
            "_id": "67e1ae2c8e70d64b11009f42",
            "username": "avinash_07_avi",
            "fullname": "Avinash Verma",
            "email": "avinash1921avi@gmail.com",
            "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742843434/ig3z9jeqkgedhgzu2kyg.png",
            "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742843435/z0wnkneuavjltzfo5okt.png",
            "createdAt": "2025-03-24T19:10:36.785Z",
            "updatedAt": "2025-03-25T08:11:01.894Z",
            "__v": 0
        },
        {
            "_id": "67e26dc297ddedca77cb7f53",
            "username": "abhay_2004",
            "fullname": "abhay pratap singh",
            "email": "abhay123@gmail.com",
            "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742892478/a070xwevuiy2zopp9lal.png",
            "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742892480/o8qcl1rw0c0ny2vxebu2.png",
            "createdAt": "2025-03-25T08:48:02.663Z",
            "updatedAt": "2025-03-26T08:13:57.250Z",
            "__v": 0
        },
        {
            "_id": "67e4e2f85736b4e9337caa98",
            "username": "vaibhav_135",
            "fullname": "vaibhav singh rajput",
            "email": "vaibhav@gmail.com",
            "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743053557/nhek3avlbe3st7f1rsns.png",
            "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743053559/aytjcjldflmzjjhgstp6.png",
            "createdAt": "2025-03-27T05:32:40.895Z",
            "updatedAt": "2025-03-28T15:02:11.635Z",
            "__v": 0
        },
        {
            "_id": "67e6fabb678a8d5818ed8b86",
            "username": "apexninja",
            "fullname": "anshu",
            "email": "anshu@hmail.com",
            "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743190711/wp1wmjs6q4dpos0e44dq.png",
            "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743190713/w3ugb5zwolt4wkdridji.png",
            "createdAt": "2025-03-28T19:38:35.210Z",
            "updatedAt": "2025-03-28T19:38:35.567Z",
            "__v": 0
        }
    ],
    "success": true
}
*/

/* send message
{
    "message": "Successfully send message",
    "statusCode": 200,
    "data": {
        "senderId": "67e2656197ddedca77cb7edd",
        "reciverId": "67e2656197ddedca77cb7edd",
        "text": "My name is Aryan Yadav I am doing DSA With kunnal kushwaha",
        "image": "",
        "_id": "67e7240aef4df71d2744fe08",
        "createdAt": "2025-03-28T22:34:50.255Z",
        "updatedAt": "2025-03-28T22:34:50.255Z",
        "__v": 0
    },
    "success": true
} 
 */

/* getMessage
{
    "message": "Successfully get message",
    "statusCode": 200,
    "data": [
        {
            "_id": "67e7240aef4df71d2744fe08",
            "senderId": "67e2656197ddedca77cb7edd",
            "reciverId": "67e2656197ddedca77cb7edd",
            "text": "My name is Aryan Yadav I am doing DSA With kunnal kushwaha",
            "image": "",
            "createdAt": "2025-03-28T22:34:50.255Z",
            "updatedAt": "2025-03-28T22:34:50.255Z",
            "__v": 0
        }
    ],
    "success": true
}
*/