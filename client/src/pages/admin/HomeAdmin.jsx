import Sidebar from "../../components/admin/layout/Sidebar";
import MovieManagement from "./movies/MovieManagement";

const HomeAdmin = () => {
  return (
    <>
      <Sidebar />
      <MovieManagement />
    </>
  );
};

export default HomeAdmin;
