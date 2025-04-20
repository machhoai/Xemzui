import React from "react";
import MovieList from "../components/MovieList";
import MovieFliter from "../components/MovieFilter";
import MovieFilter from "../components/MovieFilter";

export default function Home() {
  return (
    <main className="flex-grow pt-20">
      <div className="px-4 py-6">
        {/* Thêm margin dưới MovieFilter để tạo khoảng cách với MovieList */}
       <MovieFilter />
      </div>
    </main>
  );
}
