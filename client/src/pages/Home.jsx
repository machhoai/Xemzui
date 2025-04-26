import React from "react";
import MovieFilter from "../components/MovieFilter";

export default function Home() {
  return (
    <main className="flex-grow pt-20">
      <div className="px-4 py-6">
       <MovieFilter />
      </div>
    </main>
  );
}
