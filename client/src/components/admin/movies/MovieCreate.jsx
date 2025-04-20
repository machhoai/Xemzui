import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  Switch,
  message,
  Alert,
} from "antd";
import { ArrowLeftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { createMovie } from "../../../services/movieService";

const { TextArea } = Input;
const { Option } = Select;

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

const MovieCreate = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [posterPreview, setPosterPreview] = useState("");
  const [backdropPreview, setBackdropPreview] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    if (selectedGenres && selectedGenres.length > 0) {
      generateCustomId(selectedGenres[0]);
    } else {
      setGeneratedId("");
    }
  }, [selectedGenres]);

  // Tạo ID 
  const generateCustomId = (firstGenreId) => {
    const prefix = "MV";
    const paddedGenreId = String(firstGenreId).padStart(5, "0");
    const randomSequence = Math.floor(1000000 + Math.random() * 9000000);
    const paddedSequence = String(randomSequence).padStart(7, "0");

    const customId = `${prefix}${paddedGenreId}${paddedSequence}`;
    setGeneratedId(customId);
  };

  // Xử lý khi thay đổi genre
  const handleGenreChange = (values) => {
    setSelectedGenres(values);
  };

  // Xử lý khi submit form
  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      // Thêm ID được tạo tự động vào dữ liệu
      if (generatedId) {
        values.id = generatedId;
      }

      await createMovie(values);
      message.success("Tạo phim thành công!");
      window.location.href = "/admin/movies";
    } catch (error) {
      message.error("Lỗi khi tạo phim: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    window.location.href = "/admin/movies";
  };

  return (
    <div className="bg-[#151f30] min-h-screen px-4 py-6 text-white max-w-7xl mx-auto w-full">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="mr-3 bg-transparent text-white border-0"
        />
        <h2 className="text-xl text-white font-bold">Tạo phim mới</h2>
      </div>

      {/* Hiển thị ID tự động */}
      {generatedId && (
        <Alert
          message={
            <div className="flex justify-between items-center">
              <span className="font-bold">ID phim: {generatedId}</span>
              <span className="text-xs text-gray-400">
                (ID sẽ được tạo tự động dựa vào thể loại đầu tiên)
              </span>
            </div>
          }
          type="info"
          icon={<InfoCircleOutlined />}
          className="mb-4"
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cột trái - Hình ảnh */}
          <div className="space-y-6 w-full">
            <div className="bg-[#16213e] p-4 rounded-lg">
              <Form.Item
                label={<span className="text-white">Poster</span>}
                name="poster_path"
              >
                <div className="space-y-3">
                  <div
                    className="bg-[#0d1829] border border-dashed border-gray-600 rounded-lg overflow-hidden"
                    style={{ minHeight: "240px" }}
                  >
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="Poster preview"
                        className="w-full object-contain max-h-80"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-60">
                        <span className="text-gray-400">
                          Chưa có ảnh poster
                        </span>
                      </div>
                    )}
                  </div>

                  <Input
                    placeholder="Nhập đường dẫn poster_path"
                    className="bg-[#1e293b] text-white border-gray-700"
                    onChange={(e) => {
                      const value = e.target.value;
                      form.setFieldsValue({ poster_path: value });
                      if (value.startsWith("/")) {
                        setPosterPreview(
                          `https://image.tmdb.org/t/p/w500${value}`
                        );
                      } else if (value) {
                        setPosterPreview(value);
                      } else {
                        setPosterPreview("");
                      }
                    }}
                  />
                </div>
              </Form.Item>
            </div>

            <div className="bg-[#16213e] p-4 rounded-lg">
              <Form.Item
                label={<span className="text-white">Backdrop</span>}
                name="backdrop_path"
              >
                <div className="space-y-3">
                  <div
                    className="bg-[#0d1829] border border-dashed border-gray-600 rounded-lg overflow-hidden"
                    style={{ height: "120px" }}
                  >
                    {backdropPreview ? (
                      <img
                        src={backdropPreview}
                        alt="Backdrop preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400">
                          Chưa có ảnh backdrop
                        </span>
                      </div>
                    )}
                  </div>

                  <Input
                    placeholder="Nhập đường dẫn backdrop_path"
                    className="bg-[#1e293b] text-white border-gray-700"
                    onChange={(e) => {
                      const value = e.target.value;
                      form.setFieldsValue({ backdrop_path: value });
                      if (value.startsWith("/")) {
                        setBackdropPreview(
                          `https://image.tmdb.org/t/p/w1280${value}`
                        );
                      } else if (value) {
                        setBackdropPreview(value);
                      } else {
                        setBackdropPreview("");
                      }
                    }}
                  />
                </div>
              </Form.Item>
            </div>
          </div>

          {/* Cột phải - Thông tin */}
          <div className="md:col-span-2 space-y-6 w-full">
            <div className="bg-[#16213e] p-4 rounded-lg">
              <Form.Item
                label={<span className="text-white">Tiêu đề</span>}
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
              >
                <Input
                  placeholder="Nhập tiêu đề"
                  className="bg-[#1e293b] text-white border-gray-700"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-white">Tiêu đề gốc</span>}
                name="original_title"
                rules={[
                  { required: true, message: "Vui lòng nhập tiêu đề gốc!" },
                ]}
              >
                <Input
                  placeholder="Nhập tiêu đề gốc"
                  className="bg-[#1e293b] text-white border-gray-700"
                />
              </Form.Item>

              <Form.Item
                label={<span className="text-white">Mô tả</span>}
                name="overview"
              >
                <TextArea
                  placeholder="Nhập mô tả"
                  rows={4}
                  className="bg-[#1e293b] text-white border-gray-700"
                />
              </Form.Item>
            </div>

            <div className="bg-[#16213e] p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-white">Ngày phát hành</span>}
                  name="release_date"
                >
                  <Input
                    placeholder="YYYY-MM-DD"
                    className="bg-[#1e293b] text-white border-gray-700"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white">Ngôn ngữ gốc</span>}
                  name="original_language"
                >
                  <Select
                    placeholder="Chọn ngôn ngữ gốc"
                    dropdownStyle={{
                      backgroundColor: "#1e293b",
                      color: "white",
                    }}
                    className="bg-[#1e293b] text-white border-gray-700"
                  >
                    <Option value="en">Tiếng Anh</Option>
                    <Option value="it">Tiếng Ý</Option>
                    <Option value="vi">Tiếng Việt</Option>
                    <Option value="ko">Tiếng Hàn</Option>
                    <Option value="ja">Tiếng Nhật</Option>
                    <Option value="fr">Tiếng Pháp</Option>
                    <Option value="zh">Tiếng Trung</Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                label={<span className="text-white">Thể loại</span>}
                name="genre_ids"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ít nhất một thể loại!",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn thể loại phim"
                  dropdownStyle={{ backgroundColor: "#1e293b" }}
                  className="bg-[#1e293b] text-white border-gray-700"
                  onChange={handleGenreChange}
                >
                  {Object.entries(GENRE_MAP).map(([id, name]) => (
                    <Option key={id} value={parseInt(id)}>
                      {name} (ID: {id})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="bg-[#16213e] p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  label={<span className="text-white">Độ phổ biến</span>}
                  name="popularity"
                >
                  <InputNumber
                    placeholder="Nhập độ phổ biến"
                    min={0}
                    step={0.1}
                    className="w-full bg-[#1e293b] text-white border-gray-700"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white">Điểm đánh giá</span>}
                  name="vote_average"
                >
                  <InputNumber
                    placeholder="Nhập điểm đánh giá"
                    min={0}
                    max={10}
                    step={0.001}
                    className="w-full bg-[#1e293b] text-white border-gray-700"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white">Lượt đánh giá</span>}
                  name="vote_count"
                >
                  <InputNumber
                    placeholder="Nhập lượt đánh giá"
                    min={0}
                    className="w-full bg-[#1e293b] text-white border-gray-700"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label={<span className="text-white">Nội dung 18+</span>}
                  name="adult"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  label={<span className="text-white">Có video</span>}
                  name="video"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </div>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                className="w-full h-12 text-lg font-bold bg-blue-600 border-0"
              >
                Tạo phim
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default MovieCreate;
