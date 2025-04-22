import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Space, message, Popconfirm, Input, Dropdown } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  SearchOutlined,
  MoreOutlined
} from "@ant-design/icons";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { deleteMovie } from "../../../services/movieService";
import { fetchGetGenres } from "../../../services/MoviesApi"; 

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreList, setGenreList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await fetchGetGenres();
        const map = genreList.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
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
    fetchMovies(currentPage);
  }, [currentPage]);

  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://xemzui-production.up.railway.app/api/movie?page=${page}&limit=10${searchQuery ? `&search=${searchQuery}` : ''}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMovies(data.movies);
        setTotalItems(data.total);
      } else {
        message.error(data.message || "Error fetching movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      message.error("An error occurred while fetching movies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteMovie(record.id);
      const updatedMovies = movies.filter((movie) => movie.id !== record.id);
      setMovies(updatedMovies);
      setTotalItems((prevTotal) => prevTotal - 1);
      if (updatedMovies.length === 0 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
      message.success("Movie deleted successfully");
    } catch (error) {
      console.error("Error deleting movie:", error);
      message.error(error.message || "Failed to delete movie");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      fetchMovies(currentPage);
    }
  };

  const handleSearchSubmit = () => {
    fetchMovies(1);
  };

  const columns = [
    {
      title: <span className="font-medium text-gray-300">ID</span>,
      dataIndex: "id",
      key: "key",
      width: 80,
      render: (id) => <span className="font-mono text-blue-400">{id}</span>,
    },
    {
      title: <span className="font-medium text-gray-300">POSTER</span>,
      dataIndex: "poster_path",
      key: "poster",
      width: 120,
      render: (poster_path) => (
        <div className="relative group">
          <img
            src={poster_path 
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"}
            alt="Movie Poster"
            className="object-cover w-16 h-24 transition-transform duration-300 rounded-lg shadow-md group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 rounded-lg opacity-0 bg-opacity-30 group-hover:opacity-100">
          </div>
        </div>
      ),
    },
    {
      title: <span className="font-medium text-gray-300">TITLE</span>,
      dataIndex: "title",
      key: "title",
      render: (title) => <span className="font-medium text-blue-400">{title}</span>,
    },
    {
      title: <span className="font-medium text-gray-300">RATING</span>,
      dataIndex: "vote_average",
      key: "rating",
      width: 100,
      render: (vote_average) => {
        const rating = Number(vote_average);
        return !isNaN(rating) ? (
          <div className="flex items-center">
            <span className="mr-1 font-medium text-yellow-400">
              {rating.toFixed(1)}
            </span>
            <span className="text-yellow-400">★</span>
          </div>
        ) : (
          <span className="text-gray-400">N/A</span>
        );
      },
    },
    {
      title: <span className="font-medium text-gray-300">GENRES</span>,
      dataIndex: "genre_ids",
      key: "category",
      width: 180,
      render: (genre_ids) => (
        <div className="flex flex-wrap gap-1">
          {genre_ids?.slice(0, 2).map((id) => (
            <Tag key={id} color="blue" className="m-0">
              {genreList[id] || "Unknown"}
            </Tag>
          ))}
          {genre_ids?.length > 2 && (
            <Tag color="geekblue" className="m-0">
              +{genre_ids.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: <span className="font-medium text-gray-300">STATUS</span>,
      dataIndex: "video",
      key: "status",
      width: 100,
      render: (video) => (
        <Tag
          color={video ? "green" : "red"}
          className="px-2 py-1 text-white rounded-full"
        >
          {video ? "Active" : "Hidden"}
        </Tag>
      ),
    },
    {
      title: <span className="font-medium text-gray-300">RELEASED</span>,
      dataIndex: "release_date",
      key: "createdDate",
      width: 120,
      render: (date) => (
        <span className="text-gray-400">{date || "Unknown"}</span>
      ),
    },
    {
      title: <span className="font-medium text-gray-300">ACTIONS</span>,
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                label: 'View Details',
                icon: <EyeOutlined />,
                onClick: () => handleView(record)
              },
              {
                key: 'edit',
                label: 'Edit Movie',
                icon: <EditOutlined />,
                onClick: () => handleEdit(record)
              },
              {
                key: 'delete',
                label: (
                  <Popconfirm
                    title="Xóa phim này?"
                    description="Bạn có chắc chắn muốn xóa phim này không?"
                    onConfirm={() => handleDelete(record)}
                    okText="Có, xóa phim"
                    cancelText="Không"
                    okButtonProps={{
                      className: "!bg-red-500 !hover:bg-red-600"
                    }}
                  >
                    <div className="flex items-center">
                      <DeleteOutlined className="mr-2" />
                      <span>Delete</span>
                    </div>
                  </Popconfirm>
                ),
                danger: true,
              } 
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined className="text-gray-400 hover:text-white" />}
            className="rounded-full hover:bg-gray-700"
          />
        </Dropdown>
      ),
    },
  ];

  const handleView = (record) => {
    console.log("View movie:", record);
  };

  const handleEdit = (record) => {
    navigate(`/admin/movies/update/${record.id}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="mx-auto max-w-7xl ">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center ">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Movie Catalog
            </h1>
            <p className="mt-1 text-gray-400">
              {totalItems} movies in database
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 md:flex-row md:w-auto ">
            <Input
              placeholder="Search movies..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchQuery}
              onChange={handleSearch}
              onPressEnter={handleSearchSubmit}
              className="w-full h-10 text-white bg-gray-800 border-gray-700 rounded-lg md:w-64"
              allowClear
            />
            <div className="flex gap-3">
              <Button
                icon={<FilterOutlined />}
                className="h-10 text-white bg-gray-800 border-gray-700 rounded-lg hover:bg-gray-700"
              >
                Filters
              </Button>
              <Link to="/admin/movies/create">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="flex items-center h-10 bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                  Add Movie
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden bg-gray-800 bg-opacity-50 border border-gray-700 shadow-xl rounded-xl">
          <Table
            columns={columns}
            dataSource={movies.map((movie, index) => ({
              key: movie.id || index,
              ...movie,
            }))}
            loading={loading}
            pagination={{
              current: currentPage,
              total: totalItems,
              pageSize: 10,
              showSizeChanger: false,
              itemRender: (current, type, originalElement) => {
                if (type === "prev") {
                  return (
                    <button className="!text-white !hover:text-blue-400 !px-3 !py-1">
                      ← Previous
                    </button>
                  );
                }
                if (type === "next") {
                  return (
                    <button className="!text-white !hover:text-blue-400 !px-3 !py-1">
                      Next →
                    </button>
                  );
                }
                return originalElement;
              },
              className: "text-white",
            }}
            onChange={(pagination) => setCurrentPage(pagination.current)}
            className="[&_.ant-table-thead>tr>th]:bg-gray-800 [&_.ant-table-thead>tr>th]:border-gray-700"
            scroll={{ x: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieManagement;