import Sidebar from "../../../components/admin/layout/Sidebar";
import MovieManagement from "../../../components/admin/movies/MovieManagement";

const DashboardMovieAdmin = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 bg-gray-800 text-white fixed h-full z-10">
        <Sidebar />
      </div>
      <div className="ml-64 flex-1 overflow-y-auto h-full bg-gray-800 p-6">
        <MovieManagement />
      </div>
    </div>
  );
};

export default DashboardMovieAdmin;
