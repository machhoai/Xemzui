import React, { useState, useEffect } from 'react';
import { Table, Button, message, Popconfirm } from 'antd';
import MovieFormModal from '../../../components/admin/movies/MovieFormModal';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Lấy danh sách phim từ backend
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/movies', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setMovies(data);
      } else {
        message.error(data.message || 'Lỗi khi lấy danh sách phim');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Có lỗi xảy ra khi lấy danh sách phim');
    }
  };

  const handleAddOrUpdateMovie = async (movieData) => {
    try {
      const url = movieData._id
        ? `http://localhost:8000/api/movies/${movieData._id}`
        : 'http://localhost:8000/api/movies';
      const method = movieData._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: movieData.title, genre: movieData.genre }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchMovies();
        message.success(data.message || 'Thành công');
      } else {
        message.error(data.message || 'Lỗi khi lưu phim');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Có lỗi xảy ra khi lưu phim');
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/movies/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        fetchMovies();
        message.success(data.message || 'Xóa thành công');
      } else {
        message.error(data.message || 'Lỗi khi xóa phim');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      message.error('Có lỗi xảy ra khi xóa phim');
    }
  };

  const openModal = (movie = null) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Thể loại',
      dataIndex: 'genre',
      key: 'genre',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <div className="space-x-2">
          <Button type="primary" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa phim này?"
            onConfirm={() => handleDeleteMovie(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="ml-64 p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản lý Movie</h2>
        <Button
          type="primary"
          onClick={() => openModal()}
          className="bg-green-500 hover:bg-green-600 border-none"
        >
          Thêm phim
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={movies}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        className="bg-gray-800 text-white"
      />
      <MovieFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddOrUpdateMovie}
        movie={selectedMovie}
      />
    </div>
  );
};

export default MovieManagement;