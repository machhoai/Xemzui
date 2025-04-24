const { MoviesCollection, GenresCollection } = require("../config/ConnectDB");
const asyncHandler = require("express-async-handler");

// ******** PUBLIC CONTROLLER ********

// get all movie
// GET /api/movies

const getMovies = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    // Lấy các query parameters từ request
    const { genres, years, sort,search } = req.query;
    // Khởi tạo filter rỗng
    const filter = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // Không phân biệt hoa thường
      filter.title = regex;
    }
    // Lọc theo genre_ids (chứa ít nhất 1 trong danh sách genres)
    if (genres) {
      const genreArray = genres.split(',').map((g) => parseInt(g));
      filter.genre_ids = { $in: genreArray };
    }
    // Lọc theo năm phát hành
    if (years) {
      const yearArray = years.split(',');
      filter.release_date = {
        $gte: `${Math.min(...yearArray)}-01-01`,
        $lte: `${Math.max(...yearArray)}-12-31`,
      };
    }
    // Xử lý sắp xếp (sort)
    let sortOption = {};
    if (sort === "Mới nhất") {
      sortOption.release_date = -1;
    } else if (sort === "Cũ nhất") {
      sortOption.release_date = 1;
    } else if (sort === "Tên A-Z") {
      sortOption.title = 1;
    } else if (sort === "Tên Z-A") {
      sortOption.title = -1;
    }
    // Nếu không có filter, lấy toàn bộ phim
    const query = Object.keys(filter).length ? filter : {};
    const movies = await MoviesCollection.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await MoviesCollection.countDocuments(query);
    res.json({
      movies,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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


// get genre 
// GET /api/getGenres
const getGenresList = asyncHandler(async (req, res) => {
  try {
    const genres = await GenresCollection.find({}).toArray();;
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ******** ADMIN CONTROLLER ********

// update movie
// Put /api/movies/:id
// Update Movie Controller
const updateMovie = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
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

    console.log("Update movie data:", req.body);
    

    // Validate required fields
    if (!id || !title || !original_title) {
      res.status(400);
      throw new Error("Missing required fields");
    }

    // Check if movie exists and belongs to the user
    const existingMovie = await MoviesCollection.findOne({
      id: id,
      userId: req.user._id
    });

    if (!existingMovie) {
      res.status(404);
      throw new Error("Movie not found or unauthorized");
    }

    // Prepare update object
    const updateData = {
      adult: adult || existingMovie.adult,
      backdrop_path: backdrop_path || existingMovie.backdrop_path,
      genre_ids: genre_ids || existingMovie.genre_ids,
      original_language: original_language || existingMovie.original_language,
      original_title: original_title || existingMovie.original_title,
      overview: overview || existingMovie.overview,
      popularity: popularity || existingMovie.popularity,
      poster_path: poster_path || existingMovie.poster_path,
      release_date: release_date || existingMovie.release_date,
      title: title || existingMovie.title,
      video: video || existingMovie.video,
      vote_average: vote_average || existingMovie.vote_average,
      vote_count: vote_count || existingMovie.vote_count,
      updatedAt: new Date()
    };

    // Perform the update
    const result = await MoviesCollection.updateOne(
      { id: id, userId: req.user._id },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      res.status(400);
      throw new Error("No changes made or update failed");
    }

    // Return the updated movie
    const updatedMovie = await MoviesCollection.findOne({ id: id });
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Update movie error:", error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || "Internal server error" 
    });
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
  updateMovie,
  getGenresList,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  deleteAllMovie,
  createMovie,
};
