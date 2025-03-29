import {asyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import axios from "axios"

const getUpcomingMovies = asyncHandler(async(_,res) => {
    try {
        const apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`;
        const response = await axios.get(apiUrl);
        return res
            .status(200)
            .json(new ApiResponse(
                200, 
                response.data?.results, 
                "Successfully fetched upcoming movies"
            ));
    } catch (error) {
        return res
        .status(500)
        .json(new ApiError(
            500, 
            error.message
        ));
    }
})

export {getUpcomingMovies}