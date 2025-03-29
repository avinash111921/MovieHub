import { Router } from "express"
import { getUpcomingMovies } from "../controllers/upcomingMovieController.js"


const router = Router();

router.route("/upcoming-movies").get(getUpcomingMovies);

export { router as upcomingMovieRouter };

/* Example response format:
{
  "dates": {
    "maximum": "2025-04-23",
    "minimum": "2025-04-02"
  },
  "page": 1,
  "results": [
    {
      "adult": false,
      "backdrop_path": "/u7j9GwAzEuDmYikzhMDWC9kCAiG.jpg",
      "genre_ids": [
        10751,
        14
      ],
      "id": 447273,
      "original_language": "en",
      "original_title": "Snow White",
      "overview": "Princess Snow White flees the castle when the Evil Queen, in her jealousy over Snow White's inner beauty, tries to kill her. Deep into the dark woods, she stumbles upon seven magical dwarves and a young thief named Jonathan. Together, they strive to survive the Queen's relentless pursuit and aspire to take back the kingdom in the process...",
      "popularity": 278.4259,
      "poster_path": "/xWWg47tTfparvjK0WJNX4xL8lW2.jpg",
      "release_date": "2025-03-19",
      "title": "Snow White",
      "video": false,
      "vote_average": 4.455,
      "vote_count": 381
    }
  ]
}
*/ 