import { Router } from "express";
import {
    createTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
    deleteTweet,
    updatePoster
} from "../controllers/tweetController.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import cors from 'cors';

const router = Router();

// Enable CORS
router.use(cors());

// Public routes
router.route("/").post(
    verifyJWT,
    upload.fields([
        {
            name : "poster",
            maxCount : 1,
        }
    ]),
    createTweet
);

// Public route to get all tweets with populated user data
router.route("/tweets").get(getAllTweets);

// Protected routes
router.use(verifyJWT);

router.route("/tweets/user/:userId").get(getUserTweets);

router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);
router.route("/poster/:tweetId").patch(upload.single("poster"),updatePoster);

export { router as tweetRouter };

/* CreateTweet
{
    "message": "Successfully created tweet",
    "statusCode": 200,
    "data": {
        "content": "\"My name is viabhva singh rajput i am chhinar of ECE Section I . EID mubarak",
        "poster": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743412120/cq43n1unawlayoleq8ah.png",
        "owner": "67e4e2f85736b4e9337caa98",
        "_id": "67ea5b9b1974b31a4f653e5b",
        "createdAt": "2025-03-31T09:08:43.981Z",
        "updatedAt": "2025-03-31T09:08:43.981Z",
        "__v": 0
    },
    "success": true
}
*/

/* getAll TWeet
{
    "message": "Successfully fetched tweets",
    "statusCode": 200,
    "data": [
        {
            "_id": "67ea2884d1b0dcec00c027f7",
            "content": "Hello Guy's I am here to publish a tweet and share some information",
            "createdAt": "2025-03-31T05:30:44.152Z",
            "updatedAt": "2025-03-31T05:30:44.152Z",
            "__v": 0
        },
        {
            "_id": "67ea2a7269368d206aa594c1",
            "content": "Hello Guy's I am here to publish a tweet and share some information i am vaibhav singh rajput",
            "createdAt": "2025-03-31T05:38:58.471Z",
            "updatedAt": "2025-03-31T05:38:58.471Z",
            "__v": 0
        },
        {
            "_id": "67ea2cebd3c91cb85a8179c9",
            "content": "Hello Guy's I am here to publish a tweet and share some information i am vaibhav singh rajput",
            "createdAt": "2025-03-31T05:49:31.899Z",
            "updatedAt": "2025-03-31T05:49:31.899Z",
            "__v": 0
        },
        {
            "_id": "67ea5b9b1974b31a4f653e5b",
            "content": "\"My name is viabhva singh rajput i am chhinar of ECE Section I . EID mubarak",
            "poster": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743412120/cq43n1unawlayoleq8ah.png",
            "owner": "67e4e2f85736b4e9337caa98",
            "createdAt": "2025-03-31T09:08:43.981Z",
            "updatedAt": "2025-03-31T09:08:43.981Z",
            "__v": 0
        }
    ],
    "success": true
}
*/

/*updated tweet
{
    "message": "Successfully updated tweet",
    "statusCode": 200,
    "data": {
        "_id": "67ea5b9b1974b31a4f653e5b",
        "content": "my name is vaibhav singh rajput i am CHINAR PRO MAX",
        "poster": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743412120/cq43n1unawlayoleq8ah.png",
        "owner": "67e4e2f85736b4e9337caa98",
        "createdAt": "2025-03-31T09:08:43.981Z",
        "updatedAt": "2025-03-31T09:19:33.406Z",
        "__v": 0
    },
    "success": true
} 
 */

/* updatePoster
{
    "message": "Poster image updated successfully",
    "statusCode": 200,
    "data": {
        "_id": "67ea5b9b1974b31a4f653e5b",
        "content": "my name is vaibhav singh rajput i am CHINAR PRO MAX",
        "poster": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743413396/qnhruta9frbn5h2oxifb.png",
        "owner": "67e4e2f85736b4e9337caa98",
        "createdAt": "2025-03-31T09:08:43.981Z",
        "updatedAt": "2025-03-31T09:29:58.203Z",
        "__v": 0
    },
    "success": true
}
*/


/* delete Tweet
{
    "message": "Tweet deleted successfully!",
    "statusCode": 200,
    "data": {
        "_id": "67ea5b9b1974b31a4f653e5b",
        "content": "my name is vaibhav singh rajput i am CHINAR PRO MAX",
        "poster": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743413396/qnhruta9frbn5h2oxifb.png",
        "owner": "67e4e2f85736b4e9337caa98",
        "createdAt": "2025-03-31T09:08:43.981Z",
        "updatedAt": "2025-03-31T09:29:58.203Z",
        "__v": 0
    },
    "success": true
}
*/

/* getUserTweets
{
    "message": "Successfully fetched user tweets",
    "statusCode": 200,
    "data": [
        {
            "_id": "67ea7eb0da6e5df3b7422c47",
            "content": "Hello i think this page need correction or update",
            "poster": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743421102/bsb2taxr3ecd9bxgfdbu.png",
            "owner": {
                "_id": "67e4e2f85736b4e9337caa98"
            },
            "createdAt": "2025-03-31T11:38:24.391Z",
            "updatedAt": "2025-03-31T11:38:24.391Z",
            "__v": 0
        },
        {
            "_id": "67ea7d22da6e5df3b7422c28",
            "content": "hello my name is vaibhav singh",
            "poster": "http://res.cloudinary.com/dojfug7t8/image/upload/v1743425264/o4vqsmddf3vhr6bp6mcg.png",
            "owner": {
                "_id": "67e4e2f85736b4e9337caa98"
            },
            "createdAt": "2025-03-31T11:31:46.130Z",
            "updatedAt": "2025-03-31T12:47:46.445Z",
            "__v": 0
        }
    ],
    "success": true
}*/