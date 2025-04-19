import React from "react";
import { useState, useEffect } from "react";
import { ShareSocialOutline, Play } from "react-ionicons";
// import backdrop from "../assets/images/backdrop.webp";
// import poster from "../assets/images/poster.webp";
import { useParams } from "react-router-dom";
import {fetchMovieDetail} from "../services/MoviesApi";


export default function MovieDetail() {
    const movieId  = useParams().id;
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        async function getMovie() {
          const data = await fetchMovieDetail(movieId);
          setMovie(data);
        }
        getMovie();
        console.log(movieId);
    }, [movieId]);

    if (!movie) {
        return (
          <div className="w-full h-screen flex items-center justify-center bg-gray-900">
            <h1 className="text-2xl text-white">Đang tải thông tin phim...</h1>
          </div>
        );
      }

    return (
        <>
            <div className="Background">
                <div 
                    className="top h-[100vh] w-full bg-no-repeat bg-center bg-cover" 
                    style={{backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`}}>
                </div>
                <div className="bottom bg-[linear-gradient(to_top,_#111111_60%,_transparent_100%)] h-[140vh] w-full flex flex-col items-center justify-center gap-4 p-4 absolute top-0">
                    <div className="content relative w-3/5">
                        <div className="title text-white">
                            <p className="original-title text-xl">{movie.original_title}</p>
                            <h1 className="title text-6xl font-semibold">{movie.title}</h1>
                        </div>
                        <div className="genres mt-6 flex items-center justify-between">
                            <span className="genres display flex gap-2 text-sm text-white font-regular">
                                <span className="px-3 py-1 bg-gray-700/30 rounded-lg border-[1px] border-white">Viễn tưởng</span>
                                <span className="px-3 py-1 bg-gray-700/30 rounded-lg border-[1px] border-white">Hành động</span>
                                <span className="px-3 py-1 bg-gray-700/30 rounded-lg border-[1px] border-white">Phiêu Lưu</span>
                            </span>
                            <span className="share-icon flex items-center justify-center rounded-lg px-4 py-2 bg-white cursor-pointer">
                                <ShareSocialOutline color={"#111111"} height="26px" width="26px"/>
                            </span>
                        </div>
                        <div className="play&information flex items-center justify-between mt-6 gap-2 text-white font-semibold">
                            <span className="Play w-1/5 h-32 flex items-center justify-center rounded-3xl px-4 py-2 bg-green-500 cursor-pointer">
                                <Play color={"#fff"} height="50px" width="50px"/>
                            </span>
                            <span className="Rating w-1/5 h-32 flex items-center justify-center rounded-3xl px-4 py-2 bg-gray-700/30 relative">
                                <span className="lable absolute left-0 -rotate-90 font-medium text-gray-600">Rating</span>
                                <span className="value text-2xl">{movie.vote_average}</span>
                            </span>
                            <span className="Release-date w-1/5 h-32 flex items-center justify-center rounded-3xl px-4 py-2 bg-gray-700/30 relative">
                                <span className="lable absolute left-0 -rotate-90 font-medium text-gray-600">Release</span>
                                <span className="value text-2xl">{movie.release_date}</span>
                            </span>
                            <span className="Rating w-1/5 h-32 flex items-center justify-center rounded-3xl px-4 py-2 bg-gray-700/30 relative">
                                <span className="lable absolute left-0 -rotate-90 font-medium text-gray-600">Rating</span>
                                <span className="value text-2xl">9.9</span>
                            </span>
                            <span className="Rating w-1/5 h-32 flex items-center justify-center rounded-3xl px-4 py-2 bg-gray-700/30 relative">
                                <span className="lable absolute left-0 -rotate-90 font-medium text-gray-600">Rating</span>
                                <span className="value text-2xl">9.9</span>
                            </span>
                        </div>
                        <div className="more-information mt-10 text-white">
                            <div className="desciption&poster flex gap-12">
                                <div className="discription w-2/3">
                                    <span className="label text-xl font-semibold">
                                        Giới thiệu:
                                    </span>
                                    <p className="mt-4 text-md font-regular text-gray-300">
                                        {movie.overview}
                                    </p>
                                </div>
                                <div className="poster w-1/3 rounded-lg overflow-hidden relative">
                                    <img src={'https://image.tmdb.org/t/p/original' + movie.poster_path} alt="movie poster" className="w-full h-full rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const MovieNotFound = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900">
            <h1 className="text-4xl font-bold text-white">Movie Not Found</h1>
        </div>
    )
}