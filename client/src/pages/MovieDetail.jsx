import React from "react";
import { useState, useEffect } from "react";
import { ShareSocialOutline, Play } from "react-ionicons";
// import backdrop from "../assets/images/backdrop.webp";
// import poster from "../assets/images/poster.webp";
import { useParams } from "react-router-dom";
import {fetchMovieDetail} from "../services/movieService";
import { useLoading } from "../contexts/LoadingContext";
import { motion } from "framer-motion";
import { OrbitProgress } from "react-loading-indicators";
import WelcomeLoad from "../components/WelcomeLoad";
import { fetchGetGenres } from "../services/movieService";


export default function MovieDetail() {
    const movieId  = useParams().id;
    const [movie, setMovie] = useState(null);
    const { isLoading ,setLoading } = useLoading();
    const [genreList, setGenreList] = useState([]);
    
    useEffect(() => {
        const fetchGenres = async () => {
            try {
            const genreList = await fetchGetGenres(); // Fetch danh sách thể loại
            const map = genreList.reduce((acc, genre) => {
                acc[genre.id] = genre.name; // Tạo GENRE_MAP từ genreList
                return acc;
            }, {});
            setGenreList(map);
            } catch (error) {
            console.error("Lỗi khi fetch genres:", error);
            }
        };
        
        fetchGenres();
    }, []);

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                setLoading(true); // bật trước khi fetch
                const data = await fetchMovieDetail(movieId);
                setMovie(data);
                setLoading(false); // tắt sau khi xong
            } catch (error) {
                console.error("Lỗi khi fetch movie detail:", error);
            } finally {
                console.error("Lỗi khi fetch movie detail:");
            }
        };
    
        fetchData();
    }, [movieId]);
    

    return (
        <>
            <MovieLoading isLoading={isLoading}/>
            {!isLoading && movie && (
                <div className="Background">
                    <div 
                        className="top h-[100vh] w-full bg-no-repeat bg-center bg-cover" 
                        style={{backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`}}>
                    </div>
                    <div className="bottom bg-[linear-gradient(to_top,_#111111_60%,_transparent_100%)] h-[140vh] w-full flex flex-col items-center justify-center gap-4 p-4 absolute top-0">
                        <div className="relative w-3/5 content">
                            <div className="text-white title">
                                <p className="text-xl original-title">{movie.original_title}</p>
                                <h1 className="text-6xl font-semibold title">{movie.title}</h1>
                            </div>
                            <div className="flex items-center justify-between mt-6 genres">
                                {/* <span className="flex gap-2 text-sm text-white genres display font-regular">
                                    <span className="px-3 py-1 bg-gray-700/30 rounded-lg border-[1px] border-white">Viễn tưởng</span>
                                    <span className="px-3 py-1 bg-gray-700/30 rounded-lg border-[1px] border-white">Hành động</span>
                                    <span className="px-3 py-1 bg-gray-700/30 rounded-lg border-[1px] border-white">Phiêu Lưu</span>
                                </span> */}
                                <span className="flex gap-2 text-sm text-white genres display font-regular">
                                    {movie.genre_ids.map((genre, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-700/30 rounded-lg border-[1px] border-white">{genreList[genre]}</span>
                                    ))}
                                </span>
                                <span className="flex items-center justify-center px-4 py-2 bg-white rounded-lg cursor-pointer share-icon">
                                    <ShareSocialOutline color={"#111111"} height="26px" width="26px"/>
                                </span>
                            </div>
                            <div className="play&information flex items-center justify-between mt-6 gap-2 text-white font-semibold">
                                <span className="flex items-center justify-center w-1/5 h-32 px-4 py-2 bg-green-500 cursor-pointer Play rounded-3xl">
                                    <Play color={"#fff"} height="50px" width="50px"/>
                                </span>
                                <span className="relative flex items-center justify-center w-1/5 h-32 px-4 py-2 Rating rounded-3xl bg-gray-700/30">
                                    <span className="absolute left-0 font-medium text-gray-600 -rotate-90 lable">Rating</span>
                                    <span className="text-2xl value">{movie.vote_average}</span>
                                </span>
                                <span className="relative flex items-center justify-center w-1/5 h-32 px-4 py-2 Release-date rounded-3xl bg-gray-700/30">
                                    <span className="absolute left-0 font-medium text-gray-600 -rotate-90 lable">Release</span>
                                    <span className="text-2xl value">{movie.release_date}</span>
                                </span>
                                <span className="relative flex items-center justify-center w-1/5 h-32 px-4 py-2 Rating rounded-3xl bg-gray-700/30">
                                    <span className="absolute left-0 font-medium text-gray-600 -rotate-90 lable">Rating</span>
                                    <span className="text-2xl value">9.9</span>
                                </span>
                                <span className="relative flex items-center justify-center w-1/5 h-32 px-4 py-2 Rating rounded-3xl bg-gray-700/30">
                                    <span className="absolute left-0 font-medium text-gray-600 -rotate-90 lable">Rating</span>
                                    <span className="text-2xl value">9.9</span>
                                </span>
                            </div>
                            <div className="mt-10 text-white more-information">
                                <div className="desciption&poster flex gap-12">
                                    <div className="w-2/3 discription">
                                        <span className="text-xl font-semibold label">
                                            Giới thiệu:
                                        </span>
                                        <p className="mt-4 text-gray-300 text-md font-regular">
                                            {movie.overview}
                                        </p>
                                    </div>
                                    <div className="relative w-1/3 overflow-hidden rounded-lg poster">
                                        <img src={'https://image.tmdb.org/t/p/original' + movie.poster_path} alt="movie poster" className="w-full h-full rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </>
    )
}

const MovieLoading = ({isLoading}) => {
    return (
        <motion.div
            initial={{opacity: 1, display: "block", zIndex: 1000000 }}
            animate={!isLoading?{opacity:0, display: "none", zIndex: 1000000 }:{opacity: 1, display: "block", zIndex: 1000000 }}
            transition={{
            delay: 2,
            duration: 0.8,
            ease: "easeInOut",
            }}
            className="fixed inset-0 w-screen h-screen overflow-hidden"
        >
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity:1}}
                transition={{
                    delay: 4,
                    duration: 0.5,
                    ease: "easeInOut",
            }}
                className="absolute transform -translate-x-1/2 translate-y-20 top-1/2 left-1/2 z-1000000 "
            >
                <OrbitProgress color="#8391a7" size="small" text="" textColor=""/>
            </motion.div>
            <WelcomeLoad />
        </motion.div>
    )
}