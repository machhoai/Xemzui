import React from "react";
import WelcomeLoad from "../components/WelcomeLoad";
import MovieCard from "../components/MovieCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import MovieList from "../components/MovieList";

export default function Home() {
  const topSlides = [
    {
      title: 'Mật Vụ Phụ Hồ',
      engTitle: 'A Working Man',
      image: 'https://static.nutscdn.com/vimg/1920-0/979a39c552cbfea9fb2a4b21bc0d297d.jpg',
      imdb: '5.9',
      quality: '4K',
      age: 'T18',
      year: '2025',
      duration: '1h 56m',
      genres: ['Hành Động', 'Chiếu Rạp', 'Gay Cấn', 'Hình Sự'],
      url: '/phim/mat-vu-phu-ho.LGc0JVra',
    },
    // Thêm slide khác nếu muốn
  ];

  return (
    <>
      <WelcomeLoad />

      {/* TopSlide ở đây luôn nè */}
      <div className="relative w-full h-[500px] overflow-hidden ">
        <Swiper
          modules={[EffectFade, Autoplay]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          loop={true}
          className="w-full h-full"
        >
         {topSlides.map((slide, index) => (
            <SwiperSlide key={index}>
                <a href={slide.url} className="block w-full h-full relative">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                </div>

                {/* Nội dung */}
                <div className="relative z-10 p-10 h-full flex flex-col justify-end text-white max-w-5xl">
                    <h3 className="text-3xl font-bold mb-1">{slide.title}</h3>
                    <h4 className="text-xl italic mb-4">{slide.engTitle}</h4>
                    <div className="flex flex-wrap gap-3 mb-3 text-sm font-semibold">
                    <span className="bg-yellow-600 px-3 py-1 rounded">IMDb {slide.imdb}</span>
                    <span className="bg-green-600 px-3 py-1 rounded">{slide.quality}</span>
                    <span className="bg-red-600 px-3 py-1 rounded">{slide.age}</span>
                    <span className="bg-gray-700 px-3 py-1 rounded">{slide.year}</span>
                    <span className="bg-gray-700 px-3 py-1 rounded">{slide.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {slide.genres.map((genre, idx) => (
                        <button
                        key={idx}
                        onClick={(e) => e.preventDefault()} // Ngăn redirect nếu click
                        className="bg-white/10 hover:bg-white/20 transition text-white px-3 py-1 text-xs rounded-full cursor-default"
                        >
                        {genre}
                        </button>
                    ))}
                    </div>
                </div>
                </a>
            </SwiperSlide>
            ))}
        </Swiper>
      </div>

      <main className="flex-grow">
        <div className="px-4 py-6">
          <h3 className="text-xl font-semibold text-white mb-4">Bạn đang quan tâm gì?</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Chủ đề */}
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
          </div>
        </div>

        <div className="px-4 py-6">
          {/* MovieCard component hiển thị phim */}
          <MovieList />
        </div>
      </main>
    </>
  );
}
