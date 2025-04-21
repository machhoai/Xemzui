import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import star_icon from "../assets/icons/star.png";
import { Link } from "react-router-dom"

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false); // 👈 trạng thái "yêu thích"

  if (!movie) {
    console.error("Movie is undefined or null");
    return null;
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const title = movie.title || "Untitled";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  const genres =
    Array.isArray(movie.genres) && movie.genres.length > 0
      ? movie.genres.join(" - ")
      : "Unknown genres";


  const handleHeartClick = (e) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev); // Toggle trạng thái yêu thích
    console.log(`Heart clicked for ${title}`);
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="movie-card max-w-60 rounded-lg overflow-hidden relative cursor-pointer hover:scale-105 transition-transform">
        <div className="top w-full h-80 rounded-lg overflow-hidden relative">
          <img src={posterUrl} alt={title} className="h-full w-full object-cover" />

          <span className="absolute top-2 left-2 h-5 px-2 py-1 bg-black/50 rounded-full text-white text-xs font-semibold flex items-center gap-1">
            <img src={star_icon} alt="Rating" className="h-full" />
            <p>{rating}</p>
          </span>

          <span
            className="absolute top-2 right-2 z-30 cursor-pointer"
            onClick={handleHeartClick}
          >
            <HeartIcon className="size-6 text-red-500" isFilled={isLiked} />
          </span>
        </div>

        <div className="bottom">
          <p className="mt-2 movie-title text-xl text-white font-semibold truncate whitespace-nowrap overflow-hidden">
            {title}
          </p>
          <span className="mt-1 flex items-center gap-2 text-sm text-white w-full font-regular">
            <p className="truncate whitespace-nowrap overflow-hidden">{genres}</p>
          </span>
        </div>
      </div>
    </Link>
  );
}

const HeartIcon = ({ className, isFilled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className={className}
  >
    <path
      d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
      fill={isFilled ? "currentColor" : "none"} // 👈 dùng currentColor => lấy theo text-red-500
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
    />
  </svg>
);
