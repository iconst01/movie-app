const path = require("path");
const express = require("express");
const hbs = require("hbs");
const axios = require("axios");

const app = express();

// Path for express
const publicDirectoryPath = path.join(__dirname, "public");
const viewsPath = path.join(__dirname, "templates/views");

// Set up handlebars and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);

// Serve static files (CSS, images, etc.)
app.use(express.static(publicDirectoryPath));

// API_KEY & URL
const API_KEY = "b492264e19168e4e04dfa64b9e187b6d";
const TMB_API_URL = "https://api.themoviedb.org/3/search/movie";

// Home route - render the search form
app.get("/", (req, res) => {
  res.render("index", {
    title: "Movie Finder",
    name: "Itaty C",
  });
});

// Search movies based on user's query
app.get("/search", async (req, res) => {
  const movieName = req.query.movie;

  if (!movieName) {
    return res.render("index", {
      title: "Movie Finder",
      name: "Itaty C",
      error: "You must provide a movie name!",
    });
  }

  try {
    // Search for the movie using the TMDB API
    const searchResponse = await axios.get(TMB_API_URL, {
      params: {
        api_key: API_KEY,
        query: movieName,

        language: "en-US",
      },
    });

    const movies = searchResponse.data.results;

    if (movies.length === 0) {
      return res.render("index", {
        title: "Movie Finder",
        name: "Itaty C",
        error: "No movies found matching your query!",
      });
    }

    // Render the search results with the movie data
    res.render("search-results", {
      title: "Search Results",
      movies: movies,
      name: "Itaty C",
      poster_path: Image,
    });
  } catch (error) {
    console.log(error);
    res.render("index", {
      title: "Movie Finder",
      name: "Itaty C",
      error: "Error fetching movie data. Please try again later.",
    });
  }
});

// Similar movies route
app.get("/similar/:movieID", async (req, res) => {
  const movieId = req.params.movieID;

  try {
    // Fetch similar movies from TMDb API
    const similarResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/similar`,
      {
        params: {
          api_key: API_KEY,
        },
      }
    );

    const similarMovies = similarResponse.data.results;

    if (similarMovies.length === 0) {
      return res.render("404", {
        title: "404",
        name: "Itaty C",
        errorMessage: "No similar movies found.",
      });
    }

    // Render the similar movies list
    res.render("similar-movies", {
      title: "Similar Movies",
      similarMovies: similarMovies, // Pass the similar movies to the view
      name: "Itaty C",
    });
  } catch (error) {
    console.log(error);
    res.render("404", {
      title: "404",
      name: "Itaty C",
      errorMessage: "Error fetching similar movies. Please try again later.",
    });
  }
});

// 404 routes for invalid URLs
app.get("/help/", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Itaty C",
    errorMessage: "Help article not found",
  });
});

// Catch route for invalid URLs
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Itaty C",
    errorMessage: "Page not found.",
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
