import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { changeCurrentPassword, loginUser, logOutUser, refreshAcessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getCurrentUser } from "../controllers/userController.js"


const router = Router();



/* /api/v1/users */
/* feilds accepts array  */

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);

// Secured routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAcessToken); 
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

export { router as userRouter };




/* register -> 
{
    "message": "user register successfully",
    "statusCode": 200,
    "data": {
        "_id": "67e6fabb678a8d5818ed8b86",
        "username": "apexninja",
        "fullname": "anshu",
        "email": "anshu@hmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743190711/wp1wmjs6q4dpos0e44dq.png",
        "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743190713/w3ugb5zwolt4wkdridji.png",
        "createdAt": "2025-03-28T19:38:35.210Z",
        "updatedAt": "2025-03-28T19:38:35.567Z",
        "__v": 0
    },
    "success": true
}
*/

/* login --->
{
    "message": "User logIn successfully",
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "67e2656197ddedca77cb7edd",
            "username": "aryan_2406",
            "fullname": "Aryan Yadav",
            "email": "aryan@gmail.com",
            "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742890335/mgxxzaabnpeicdyzuueq.png",
            "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742890337/pnnilghvmmp6q1rxu2l1.png",
            "createdAt": "2025-03-25T08:12:17.582Z",
            "updatedAt": "2025-03-28T19:41:15.093Z",
            "__v": 0
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2UyNjU2MTk3ZGRlZGNhNzdjYjdlZGQiLCJlbWFpbCI6ImFyeWFuQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYXJ5YW5fMjQwNiIsImZ1bGxuYW1lIjoiQXJ5YW4gWWFkYXYiLCJpYXQiOjE3NDMxOTA4NzUsImV4cCI6MTc0NDA1NDg3NX0.w5GhmaoA3ZcN6MGmmfFGUVcc2QqUJfUdO5lq5suQTZk",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2UyNjU2MTk3ZGRlZGNhNzdjYjdlZGQiLCJpYXQiOjE3NDMxOTA4NzUsImV4cCI6MTc0NTc4Mjg3NX0.p29tBIfxWNpsmtTtYaWX7Kg1_02K1Ivgq2Vj4bZxerk"
    },
    "success": true
}
*/


/* 
password-change --> 
{
    "message": "Password changed successfully",
    "statusCode": 200,
    "data": {},
    "success": true
}
*/


/* current user --> 
{
    "message": "Current User fetched SuccessFully",
    "statusCode": 200,
    "data": {
        "_id": "67e2656197ddedca77cb7edd",
        "username": "aryan_2406",
        "fullname": "Aryan Yadav",
        "email": "aryan@gmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742890335/mgxxzaabnpeicdyzuueq.png",
        "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742890337/pnnilghvmmp6q1rxu2l1.png",
        "createdAt": "2025-03-25T08:12:17.582Z",
        "updatedAt": "2025-03-28T21:59:16.714Z",
        "__v": 0
    },
    "success": true
} 
 */

/* update-account ->
{
    "message": "Account details updated successfully",
    "statusCode": 200,
    "data": {
        "_id": "67e2656197ddedca77cb7edd",
        "username": "bauna",
        "fullname": "aryan Bauna",
        "email": "aryan@gmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742890335/mgxxzaabnpeicdyzuueq.png",
        "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742890337/pnnilghvmmp6q1rxu2l1.png",
        "createdAt": "2025-03-25T08:12:17.582Z",
        "updatedAt": "2025-03-28T22:22:05.215Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2UyNjU2MTk3ZGRlZGNhNzdjYjdlZGQiLCJpYXQiOjE3NDMyMDA0NzIsImV4cCI6MTc0NTc5MjQ3Mn0.S-m3G80OgCwe1PQuVodfWMlhiheFbGkUakJeqkKiNy0"
    },
    "success": true
} 
 */

/* update avatar -> 
{
    "message": "Avatar image updated successfully",
    "statusCode": 200,
    "data": {
        "_id": "67e2656197ddedca77cb7edd",
        "username": "bauna",
        "fullname": "aryan Bauna",
        "email": "aryan@gmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743200658/t3fgsksgordz52oqzaax.png",
        "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1742890337/pnnilghvmmp6q1rxu2l1.png",
        "createdAt": "2025-03-25T08:12:17.582Z",
        "updatedAt": "2025-03-28T22:24:19.977Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2UyNjU2MTk3ZGRlZGNhNzdjYjdlZGQiLCJpYXQiOjE3NDMyMDA0NzIsImV4cCI6MTc0NTc5MjQ3Mn0.S-m3G80OgCwe1PQuVodfWMlhiheFbGkUakJeqkKiNy0"
    },
    "success": true
} 
 */

/* refreshAcessToken -> 
{
    "message": "Acess token refreshed successfully",
    "statusCode": 200,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2UyNjU2MTk3ZGRlZGNhNzdjYjdlZGQiLCJlbWFpbCI6ImFyeWFuQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiYmF1bmEiLCJmdWxsbmFtZSI6ImFyeWFuIEJhdW5hIiwiaWF0IjoxNzQzMjAwODc3LCJleHAiOjE3NDQwNjQ4Nzd9.avT7AxXSpv0UI7U_A6uD_RbzcFZ3-3CcIKUsuFOov48"
    },
    "success": true
} 
 */

/* update coverImage
{
    "message": "cover image update succesfully",
    "statusCode": 200,
    "data": {
        "_id": "67e2656197ddedca77cb7edd",
        "username": "bauna",
        "fullname": "aryan Bauna",
        "email": "aryan@gmail.com",
        "avatar": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743200658/t3fgsksgordz52oqzaax.png",
        "coverImage": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743200811/db2vbqbcywqwet7qatfd.png",
        "createdAt": "2025-03-25T08:12:17.582Z",
        "updatedAt": "2025-03-28T22:26:53.277Z",
        "__v": 0,
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2UyNjU2MTk3ZGRlZGNhNzdjYjdlZGQiLCJpYXQiOjE3NDMyMDA0NzIsImV4cCI6MTc0NTc5MjQ3Mn0.S-m3G80OgCwe1PQuVodfWMlhiheFbGkUakJeqkKiNy0"
    },
    "success": true
}
*/