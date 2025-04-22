import React from "react";
import MovieCreate from "../../../components/admin/movies/MovieCreate";

const CreateMoviePageAdmin = () => {
  return (
    <div className="ml-64 flex-1 overflow-y-auto h-full bg-[#151f30]">
      <MovieCreate />
    </div>
  );
};

export default CreateMoviePageAdmin;
