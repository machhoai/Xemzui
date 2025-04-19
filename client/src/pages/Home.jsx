import React, { useState, useEffect } from "react";
import WelcomeLoad from "../components/WelcomeLoad";
import MovieCard from "../components/MovieCard"; // Giả sử bạn có MovieCard component

export default function Home() {
    return (
        <>
            <WelcomeLoad />
            <main className="flex-grow">
                <div className="px-4 py-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Bạn đang quan tâm gì?</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        <a href="/c/marvel-sieu-anh-hung.vhyYAW" className="relative rounded-xl overflow-hidden group h-36 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#324fd1] group-hover:opacity-90 transition-opacity duration-300" />
                            <div className="relative z-10 text-center text-white">
                                <div className="text-lg font-bold mb-2">Marvel</div>
                                <div className="inline-flex items-center text-sm border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition">
                                    <span>Xem chủ đề</span>
                                    <i className="fa-solid fa-angle-right ml-2"></i>
                                </div>
                            </div>
                        </a>

                        <a href="/c/4k.bZE4Tf" className="relative rounded-xl overflow-hidden group h-36 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[#666699] group-hover:opacity-90 transition-opacity duration-300" />
                            <div className="relative z-10 text-center text-white">
                                <div className="text-lg font-bold mb-2">4K</div>
                                <div className="inline-flex items-center text-sm border border-white px-3 py-1 rounded-full hover:bg-white hover:text-black transition">
                                    <span>Xem chủ đề</span>
                                    <i className="fa-solid fa-angle-right ml-2"></i>
                                </div>
                            </div>
                        </a>

                        {/* Thêm nhiều thẻ chủ đề khác nếu cần */}
                    </div>
                </div>

                <div className="px-4 py-6">
                    {/* MovieCard */}
                    <MovieCard />
                </div>
            </main>
        </>
    );
}
