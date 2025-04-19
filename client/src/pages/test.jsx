import React from "react";

const MovieHero = () => {
  return (
    <div className="relative w-full h-screen bg-[#0f172a] text-white overflow-hidden rounded-3xl shadow-xl">
      {/* Background Image with overlay */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-center bg-cover"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 1)), url('https://image.tmdb.org/t/p/w900/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg')",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-8 px-8">
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-xl font-medium text-gray-300">Aaron Horvath  ·  Micheal Jelenic</h2>
          <h1 className="text-4xl font-extrabold text-white leading-tight mt-1">
            THE SUPER MARIO BROS. MOVIE
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {['Fantasy', 'Family', 'Action', 'Adventure'].map((tag) => (
              <span
                key={tag}
                className="bg-white/10 px-3 py-1 text-sm rounded-full border border-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Info Row */}
        <div className="flex gap-4 mt-4">
          <button className="bg-green-500 w-14 h-14 rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.25l13.5 6.75-13.5 6.75V5.25z"
              />
            </svg>
          </button>

          {[
            { title: 'RATING', value: 'PG' },
            { title: 'RELEASE', value: 'April 7, 2023' },
            { title: 'BUDGET', value: '$130M' },
            { title: 'LENGTH', value: '126 min' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-center bg-white/5 px-4 py-2 rounded-xl w-32"
            >
              <span className="text-sm text-gray-400">{item.title}</span>
              <span className="text-lg font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mt-6 max-w-3xl text-sm text-gray-300">
          A Brooklyn Plumber named Mario, travels through the Mushroom Kingdom with a Princess named Peach and an
          Anthropomorphic Mushroom named Toad to find Mario’s Brother, Luigi, and to save the world from a ruthless
          fire breathing Koopa named Bowser.
        </div>

        {/* Hype Row */}
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-1 text-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Rotten_Tomatoes_logo.svg" className="w-5 h-5" alt="RT" />
            97%
          </div>
          <div className="flex items-center gap-1 text-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" className="w-6 h-4" alt="IMDb" />
            9.4/10
          </div>
          <div className="flex items-center gap-1 text-sm">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Metacritic.svg" className="w-5 h-5" alt="MC" />
            84
          </div>
        </div>

        {/* Notable Cast */}
        <div className="mt-8">
          <h3 className="text-sm text-gray-400 uppercase">Notable Cast</h3>
          <div className="flex gap-6 mt-2">
            {[
              { name: 'Chris Pratt', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Chris_Pratt_2018.jpg' },
              { name: 'Anya Taylor-Joy', img: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Anya_Taylor-Joy_by_Gage_Skidmore.jpg' },
              { name: 'Charlie Day', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Charlie_Day_2011.jpg' },
            ].map((actor) => (
              <div key={actor.name} className="flex flex-col items-center">
                <img src={actor.img} alt={actor.name} className="w-12 h-12 rounded-full object-cover" />
                <span className="text-xs mt-1 text-center">{actor.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other Films */}
        <div className="mt-8">
          <h3 className="text-sm text-gray-400 uppercase">Other Upcoming Films</h3>
          <div className="flex gap-4 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-28 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
