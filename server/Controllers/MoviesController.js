const { MoviesCollection } = require("../config/ConnectDB");
const asyncHandler = require("express-async-handler");
const {ObjectId } = require("mongodb");

// ******** PUBLIC CONTROLLER ********

// đẩy movie lên db
// POST /api/movies/import
const importMovies = asyncHandler(async (req, res) => {
  // ở đây đảm bảo là table Movies nó rỗng nên xài delete all
  await Movie.deleteMany({});
  // sau đó import hết movie trong MoviesData
  const movies = await Movie.insertMany(MoviesData);
  res.status(201).json(movies);
});

// get all movie
// GET /api/movies


// get movie với id
// GET /api/movies/:id
const getMovieById = asyncHandler(async (req, res, movieId) => {
    try {
        // Convert string ID to ObjectId
        const movie = await MoviesCollection.findOne({ id: movieId});

        if (!movie) {
          return res.status(404).json({ error: "Movie not found" });
        }
    
        res.json(movie);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
});


const getMovies = asyncHandler(async (req, res) => {
  try {
    const {
      category,
      time,
      language,
      rate,
      year,
      director,
      boxOffice,
      search,
    } = req.query;

    let query = {
      ...(category && { category }),
      ...(time && { time }),
      ...(language && { language }),
      ...(rate && { rate }),
      ...(year && { year }),
      ...(director && { director: { $regex: director, $options: "i" } }),
      ...(boxOffice && { boxOffice: { $regex: boxOffice, $options: "i" } }),
      ...(search && { name: { $regex: search, $options: "i" } }),
    };
    
    //load pagination
    const page = Number(req.query.pageNumber) || 1;
    const limit = 2;
    const skip = (page - 1) * limit;
   

    //find movie bằng query, skip và limit
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      console.log("Danh sách phim tìm được:", movies);
    // lấy tổng số của movies
    const count = await Movie.countDocuments(query);

    //gửi res tới movie và tổng số của movie
    res.json({
      movies,
      page,
      pages: Math.ceil(count / limit),
      totalMovies: count,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get top rate movie
// GET /api/movies/rated/top
const getTopRatedMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.find({}).sort({ rate: -1 });
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// get random movie
// GET /api/movies/random/all
const getRandomMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movie.aggregate([{ $sample: { size: 8 } }]);
    res.json(movies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** PRIVATE CONTROLLER ********

// tạo review cho movie
// POST /api/movies/:id/reviews
const createReviewMovie = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      const checkReview = movie.reviews.find(
        (r) => r.userId.toString() === req.user._id.toString()
      );
      if (checkReview) {
        res.status(400);
        throw new Error("You already review movie");
      }
      // else tạo review
      const review = {
        userName: req.user.fullName,
        userId: req.user._id,
        userImage: req.user.image,
        rating: Number(rating),
        comment,
      };
      // push lên
      movie.reviews.push(review);
      // increment điểm review
      movie.numberOfReviews = movie.reviews.length;

      //tính rate mới
      movie.rate =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;

      // save movie
      await movie.save();
      // gửi tới client
      res.status(201).json({
        message: "Review successfully!",
      });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** ADMIN CONTROLLER ********

// update movie
// POST /api/movies/:id
const updateMovie = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      desc,
      titleImage,
      image,
      category,
      language,
      year,
      time,
      video,
      rate,
      director,
      boxOffice,
      numberOfReviews,
      casts,
    } = req.body;
    const movie = await Movie.findById(req.params.id);

    if (movie) {
      //logic update
      movie.name = name || movie.name;
      movie.desc = desc || movie.desc;
      movie.titleImage = titleImage || movie.titleImage;
      movie.image = image || movie.image;
      movie.category = category || movie.category;
      movie.language = language || movie.language;
      movie.year = year || movie.year;
      movie.time = time || movie.time;
      movie.video = video || movie.video;
      movie.rate = rate || movie.rate;
      movie.director = director || movie.director;
      movie.boxOffice = boxOffice || movie.boxOffice;
      movie.numberOfReviews = numberOfReviews || movie.numberOfReviews;
      movie.casts = casts || movie.casts;

      // save vô db
      const updateMovie = await movie.save();
      // gửi tới client
      res.status(201).json(updateMovie);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// delete movie
// POST /api/movies/:id
const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const movie = await MoviesCollection.findOne({ id: req.params.id });
    if (movie) {
      await MoviesCollection.deleteOne({ id: req.params.id });
      res.json({ message: 'Deleted movie' });
    } else {
      res.status(404);
      throw new Error('Movie not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete all movie
// POST /api/movies
const deleteAllMovie = asyncHandler(async (req, res) => {
  try {
    await MoviesCollection.deleteMany({});
    res.json({ message: "Deleted all movies" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// create movie
// POST /api/movies
const createMovie = asyncHandler(async (req, res) => {
  try {
    const {
      adult,
      backdrop_path,
      genre_ids,
      original_language,
      original_title,
      overview,
      popularity,
      poster_path,
      release_date,
      title,
      video,
      vote_average,
      vote_count,
    } = req.body;

    const prefix = "MV";

    const firstGenreId = genre_ids && genre_ids.length > 0 ? genre_ids[0] : 0;
    const paddedGenreId = String(firstGenreId).padStart(5, "0");

    const lastMovie = await MoviesCollection.findOne(
      { userId: req.user._id },
      { sort: { _id: -1 } }
    );

    let sequenceNumber = 1;
    if (lastMovie && lastMovie.id && lastMovie.id.startsWith("MV")) {
      const lastSequence = lastMovie.id.slice(-7);
      if (!isNaN(parseInt(lastSequence))) {
        sequenceNumber = parseInt(lastSequence) + 1;
      }
    }

    const paddedSequence = String(sequenceNumber).padStart(7, "0");

    const customId = `${prefix}${paddedGenreId}${paddedSequence}`;

    const movie = {
      adult,
      backdrop_path,
      genre_ids,
      id: customId,
      original_language,
      original_title,
      overview,
      popularity,
      poster_path,
      release_date,
      title,
      video,
      vote_average,
      vote_count,
      createdAt: new Date(),
      userId: req.user._id,
    };
    const result = await MoviesCollection.insertOne(movie);

    if (result.insertedId) {
      res.status(201).json({ _id: result.insertedId, ...movie });
    } else {
      res.status(400);
      throw new Error("Tạo movie thất bại");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  importMovies,
  getMovies,
  getMovieById,
  getTopRatedMovies,
  getRandomMovies,
  createReviewMovie,
  updateMovie,
  deleteMovie,
  deleteAllMovie,
  createMovie,
};
