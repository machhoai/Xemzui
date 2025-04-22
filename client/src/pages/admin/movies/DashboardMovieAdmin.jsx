import MovieManagement from "../../../components/admin/movies/MovieManagement";
const DashboardMovieAdmin = () => {
  return (
    <div className="flex-1 h-full p-6 ml-64 overflow-y-auto bg-gray-800">
      <MovieManagement />
    </div>
  );
};

export default DashboardMovieAdmin;
