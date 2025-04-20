import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Space, message, Modal, Popconfirm } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { deleteMovie } from "../../../services/movieService";

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const fetchMovies = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/movie?page=${page}&limit=10`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMovies(data.movies);
        setTotalItems(data.total);
        setTotalPages(data.totalPages);
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

      // Nếu danh sách trống -> quay lại trang trước
      if (updatedMovies.length === 0 && currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }

      message.success("Xóa phim thành công");
    } catch (error) {
      console.error("Lỗi xóa phim:", error);
      message.error(error.message || "Đã có lỗi xảy ra khi xóa phim");
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "key",
      width: 70,
    },
    {
      title: "POSTER",
      dataIndex: "poster_path",
      key: "poster",
      width: 100,
      render: (poster_path) => {
        const posterUrl = poster_path
          ? `https://image.tmdb.org/t/p/w500${poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image";
        return (
          <img
            src={posterUrl}
            alt="Movie Poster"
            className="w-20 h-30 object-cover rounded"
          />
        );
      },
    },
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "VOTE",
      dataIndex: "vote_average",
      key: "rating",
      render: (vote_average) => {
        const rating = Number(vote_average);
        return !isNaN(rating) ? `${rating.toFixed(1)} ★` : "N/A";
      },

      width: 100,
    },
    {
      title: "CATEGORY",
      dataIndex: "genre_ids",
      key: "category",
      width: 120,
      render: (genre_ids) => {
        const genres = genre_ids?.map((id) => GENRE_MAP[id]).filter(Boolean);
        return genres?.length ? genres.join(", ") : "Unknown";
      },
    },
    {
      title: "VIEWS",
      dataIndex: "popularity",
      key: "views",
      width: 100,
    },
    {
      title: "VIDEO",
      dataIndex: "video",
      key: "status",
      render: (video) => (
        <Tag color={video ? "green" : "red"} className="text-white">
          {video ? "Visible" : "Hidden"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "RELEASE DATE",
      dataIndex: "release_date",
      key: "createdDate",
      width: 150,
    },
    {
      title: "ACTIONS",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined className="text-white" />}
            className="hover:text-blue-500"
            onClick={() => handleView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined className="text-white" />}
            className="hover:text-green-500"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa phim"
            description="Bạn có chắc chắn muốn xóa phim này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              icon={<DeleteOutlined className="text-white" />}
              className="hover:text-red-500"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleView = (record) => {
    console.log("View movie:", record);
  };

  const handleEdit = (record) => {
    console.log("Edit movie:", record);
  };

  // Data source for the table
  const dataSource = movies.map((movie, index) => ({
    key: (currentPage - 1) * 10 + index + 23,
    ...movie,
  }));

  return (
    <div
      className="
        bg-[#151f30] 
        min-h-screen 
        p-6 
        text-white
      "
    >
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Catalog</h1>
            <span className="text-gray-400">{totalItems} total</span>
          </div>

          <div className="flex space-x-4">
            {/* Filter Button */}
            <Button
              icon={<FilterOutlined />}
              className="
                bg-[#16213e] 
                text-white 
                border-none 
                hover:bg-[#0f3460]
              "
            >
              Filter
            </Button>

            {/* Add Movie Link */}
            <Link
              to="/admin/movies/create"
              className="
                flex 
                items-center 
                justify-center
                bg-[#16213e] 
                text-white 
                border-none 
                hover:bg-[#0f3460]
                px-3 
                py-2 
                rounded
              "
            >
              <PlusOutlined className="mr-2" /> Add Movie
            </Link>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{
            current: currentPage,
            total: totalItems,
            pageSize: 10,
            totalPages: totalPages,
            showSizeChanger: false,
            itemRender: (current, type, originalElement) => {
              if (type === "prev") return <span className="text-white">←</span>;
              if (type === "next") return <span className="text-white">→</span>;
              return originalElement;
            },
          }}
          className="
            bg-[#16213e] 
            rounded-lg 
            overflow-hidden
            hover:bg-[#0f3460]
            [&_.ant-table-row:hover]:bg-[#0f3460]
            [&_.ant-table-row:hover]:bg-opacity-80
          "
          rowClassName={() => `
            bg-[#16213e] 
            text-white 
            hover:bg-[#0f3460]
          `}
          onChange={(pagination) => setCurrentPage(pagination.current)}
        />
      </div>
    </div>
  );
};

export default MovieManagement;
