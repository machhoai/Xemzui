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
  Card,
  Divider,
  Upload,
  Tag,
  Row,
  Col,
  Collapse,
  Modal,
  Result,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  UploadOutlined,
  PlusOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  StarOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { createMovie } from "../../../services/movieService";
import { fetchGetGenres } from "../../../services/movieService";

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const MovieCreate = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [posterPreview, setPosterPreview] = useState("");
  const [backdropPreview, setBackdropPreview] = useState("");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultStatus, setResultStatus] = useState("success");
  const [resultMessage, setResultMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [genreList, setGenreList] = useState([]);
  const [generatedId, setGeneratedId] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);

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
    if (selectedGenres && selectedGenres.length > 0) {
      generateCustomId(selectedGenres[0]);
    } else {
      setGeneratedId("");
    }
  }, [selectedGenres]);

  const generateCustomId = (firstGenreId) => {
    const prefix = "MV";
    const paddedGenreId = String(firstGenreId).padStart(5, "0");
    const randomSequence = Math.floor(1000000 + Math.random() * 9000000);
    const paddedSequence = String(randomSequence).padStart(7, "0");

    const customId = `${prefix}${paddedGenreId}${paddedSequence}`;
    setGeneratedId(customId);
  };

  const handleGenreChange = (values) => {
    setSelectedGenres(values);
    form.setFieldsValue({ genre_ids: values });
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (generatedId) {
        values.id = generatedId;
      }
      await createMovie(values);
      // Hiển thị thông báo thành công
      setResultStatus("success");
      setResultMessage(`Phim "${values.title}" đã được tạo thành công!`);
      setResultModalVisible(true);
      // Vẫn hiển thị message nhỏ ở góc màn hình
      message.success("Phim đã được tạo thành công!");
    } catch (error) {
      // Hiển thị thông báo lỗi
      console.error("Error creating movie:", error);
      setResultStatus("error");
      setResultMessage("Không thể tạo phim. Vui lòng kiểm tra lại thông tin.");
      setErrorDetails(error.message || "Đã xảy ra lỗi không xác định");
      setResultModalVisible(true);

      // Vẫn hiển thị message nhỏ ở góc màn hình
      message.error("Lỗi khi tạo phim: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    window.location.href = "/admin/movies";
  };

  const handleModalClose = () => {
    setResultModalVisible(false);
    if (resultStatus === "success") {
      // Nếu thành công thì chuyển về trang danh sách phim
      window.location.href = "/admin/movies";
    }
  };

  const renderGenreTags = () => {
    return selectedGenres.map((genreId) => (
      <Tag key={genreId} color="blue" className="mb-2">
        {genreList[genreId]}
      </Tag>
    ));
  };

  const ResultModal = () => (
    <Modal
      open={resultModalVisible}
      footer={null}
      onCancel={handleModalClose}
      width={500}
      className="result-modal"
      closable={false}
    >
      <Result
        status={resultStatus}
        icon={
          resultStatus === "success" ? (
            <CheckCircleOutlined className="text-5xl text-green-500" />
          ) : (
            <CloseCircleOutlined className="text-5xl text-red-500" />
          )
        }
        title={
          <div
            className={`text-xl font-medium ${
              resultStatus === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {resultStatus === "success"
              ? "Tạo phim thành công!"
              : "Tạo phim thất bại!"}
          </div>
        }
        subTitle={<p className="text-gray-600">{resultMessage}</p>}
        extra={
          <div className="mt-4">
            {resultStatus === "error" && errorDetails && (
              <Alert
                message="Chi tiết lỗi"
                description={errorDetails}
                type="error"
                className="mb-4 text-left"
                showIcon
              />
            )}
            <Space>
              {resultStatus === "success" ? (
                <>
                  <Button
                    type="primary"
                    className="bg-green-500 border-none hover:bg-green-600"
                    onClick={handleModalClose}
                  >
                    Quay lại danh sách phim
                  </Button>
                  <Button
                    onClick={() => {
                      setResultModalVisible(false);
                      form.resetFields();
                      setPosterPreview("");
                      setBackdropPreview("");
                      setSelectedGenres([]);
                      setGeneratedId("");
                    }}
                  >
                    Tạo phim mới
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    className="bg-blue-500 border-none hover:bg-blue-600"
                    onClick={() => setResultModalVisible(false)}
                  >
                    Tiếp tục chỉnh sửa
                  </Button>
                  <Button onClick={handleBack}>Quay lại danh sách phim</Button>
                </>
              )}
            </Space>
          </div>
        }
      />
    </Modal>
  );

  return (
    <div className="min-h-screen px-4 py-8 text-white bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="flex items-center justify-center p-3 mr-4 text-white bg-transparent border-0 rounded-full hover:bg-blue-800"
          />
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Create New Movie
          </h2>
        </div>

        {generatedId && (
          <Alert
            message={
              <div className="flex items-center">
                <span className="mr-2 font-bold">Movie ID:</span>
                <span className="px-2 py-1 font-mono text-white bg-blue-900 rounded">
                  {generatedId}
                </span>
                <span className="ml-4 text-sm text-blue-300">
                  (Auto-generated based on first genre)
                </span>
              </div>
            }
            type="info"
            showIcon
            className="mb-6 bg-blue-900 border border-blue-500 rounded-lg bg-opacity-30"
          />
        )}

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Collapse
            defaultActiveKey={["basic", "media", "details"]}
            ghost
            className="bg-transparent"
          >
            <Panel
              header={
                <div className="flex items-center">
                  <InfoCircleOutlined className="!mr-2 !text-blue-400 " />
                  <span className="text-lg font-medium text-white">
                    Basic Information
                  </span>
                </div>
              }
              key="basic"
              className="mb-4 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg"
            >
              <Row gutter={24}>
                <Col span={24} lg={12}>
                  <Form.Item
                    label={<span className="text-white">Title</span>}
                    name="title"
                    rules={[{ required: true, message: "Please enter title!" }]}
                  >
                    <Input
                      placeholder="Movie title"
                      className="h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-white">Original Title</span>}
                    name="original_title"
                    rules={[
                      {
                        required: true,
                        message: "Please enter original title!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Original title"
                      className="h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-white">Overview</span>}
                    name="overview"
                  >
                    <TextArea
                      placeholder="Movie description"
                      rows={5}
                      className="text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500"
                    />
                  </Form.Item>
                </Col>

                <Col span={24} lg={12}>
                  <Form.Item
                    label={<span className="text-white">Release Date</span>}
                    name="release_date"
                  >
                    <Input
                      placeholder="YYYY-MM-DD"
                      className="h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="text-white">Original Language</span>
                    }
                    name="original_language"
                  >
                    <Select
                      placeholder="Select language"
                      className="h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500"
                      dropdownStyle={{
                        backgroundColor: "#1E293B",
                        color: "white",
                      }}
                    >
                      <Option value="en">English</Option>
                      <Option value="it">Italian</Option>
                      <Option value="vi">Vietnamese</Option>
                      <Option value="ko">Korean</Option>
                      <Option value="ja">Japanese</Option>
                      <Option value="fr">French</Option>
                      <Option value="zh">Chinese</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-white">Genres</span>}
                    name="genre_ids"
                    rules={[
                      {
                        required: true,
                        message: "Please select at least one genre!",
                      },
                    ]}
                  >
                    <div>
                      <Select
                        mode="multiple"
                        placeholder="Select movie genres"
                        className="w-full text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500"
                        onChange={handleGenreChange}
                        tagRender={(props) => (
                          <Tag
                            closable={props.closable}
                            onClose={props.onClose}
                            color="blue"
                            className="flex items-center"
                          >
                            {genreList[props.value]}
                          </Tag>
                        )}
                      >
                        {Object.entries(genreList).map(([id, name]) => (
                          <Option key={id} value={parseInt(id)}>
                            {name} (ID: {id})
                          </Option>
                        ))}
                      </Select>
                      <div className="mt-2">
                        {selectedGenres.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {renderGenreTags()}
                          </div>
                        )}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            <Panel
              header={
                <div className="flex items-center">
                  <PictureOutlined className="!mr-2 !text-blue-400" />
                  <span className="text-lg font-medium text-white">Media</span>
                </div>
              }
              key="media"
              className="mb-4 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg"
            >
              <Row gutter={24}>
                <Col span={24} lg={12}>
                  <Form.Item
                    label={<span className="text-white">Poster Image</span>}
                    name="poster_path"
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <div
                          className={`bg-gray-900 border-2 border-dashed ${
                            posterPreview
                              ? "border-transparent"
                              : "border-gray-600"
                          } rounded-xl overflow-hidden transition-all duration-300 h-80 flex items-center justify-center`}
                        >
                          {posterPreview ? (
                            <img
                              src={posterPreview}
                              alt="Poster preview"
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="p-6 text-center">
                              <UploadOutlined className="mb-3 text-4xl text-gray-500" />
                              <p className="text-gray-400">
                                Upload or paste poster URL
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Recommended size: 500x750
                              </p>
                            </div>
                          )}
                        </div>
                        {posterPreview && (
                          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                            <Button
                              type="primary"
                              shape="round"
                              icon={<UploadOutlined />}
                              onClick={() =>
                                document.getElementById("poster-upload").click()
                              }
                            >
                              Change Image
                            </Button>
                          </div>
                        )}
                      </div>

                      <Input
                        id="poster-upload"
                        placeholder="Enter poster URL (or paste /path for TMDB)"
                        className="h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500"
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
                </Col>

                <Col span={24} lg={12}>
                  <Form.Item
                    label={<span className="text-white">Backdrop Image</span>}
                    name="backdrop_path"
                  >
                    <div className="space-y-4">
                      <div className="relative group">
                        <div
                          className={`bg-gray-900 border-2 border-dashed ${
                            backdropPreview
                              ? "border-transparent"
                              : "border-gray-600"
                          } rounded-xl overflow-hidden transition-all duration-300 h-48 flex items-center justify-center`}
                        >
                          {backdropPreview ? (
                            <img
                              src={backdropPreview}
                              alt="Backdrop preview"
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="p-6 text-center">
                              <UploadOutlined className="mb-3 text-4xl text-gray-500" />
                              <p className="text-gray-400">
                                Upload or paste backdrop URL
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Recommended size: 1280x720
                              </p>
                            </div>
                          )}
                        </div>
                        {backdropPreview && (
                          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                            <Button
                              type="primary"
                              shape="round"
                              icon={<UploadOutlined />}
                              onClick={() =>
                                document
                                  .getElementById("backdrop-upload")
                                  .click()
                              }
                            >
                              Change Image
                            </Button>
                          </div>
                        )}
                      </div>

                      <Input
                        id="backdrop-upload"
                        placeholder="Enter backdrop URL (or paste /path for TMDB)"
                        className="h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500"
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
                </Col>
              </Row>
            </Panel>

            <Panel
              header={
                <div className="flex items-center">
                  <StarOutlined className="!mr-2 !text-blue-400" />
                  <span className="text-lg font-medium text-white">
                    Ratings & Stats
                  </span>
                </div>
              }
              key="ratings"
              className="mb-4 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg"
            >
              <Row gutter={24}>
                <Col span={24} md={8}>
                  <Form.Item
                    label={<span className="text-white">Popularity</span>}
                    name="popularity"
                  >
                    <InputNumber
                      placeholder="Enter popularity"
                      min={0}
                      step={0.1}
                      className="w-full h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500"
                    />
                  </Form.Item>
                </Col>

                <Col span={24} md={8}>
                  <Form.Item
                    label={<span className="text-white">Vote Average</span>}
                    name="vote_average"
                  >
                    <InputNumber
                      placeholder="Enter rating"
                      min={0}
                      max={10}
                      step={0.001}
                      className="w-full h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500"
                    />
                  </Form.Item>
                </Col>

                <Col span={24} md={8}>
                  <Form.Item
                    label={<span className="text-white">Vote Count</span>}
                    name="vote_count"
                  >
                    <InputNumber
                      placeholder="Enter vote count"
                      min={0}
                      className="w-full h-12 text-white bg-gray-700 border-gray-600 rounded-lg hover:border-blue-500"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>

            <Panel
              header={
                <div className="flex items-center">
                  <SettingOutlined className="!mr-2 !text-blue-400" />
                  <span className="text-lg font-medium text-white">
                    Additional Settings
                  </span>
                </div>
              }
              key="settings"
              className="mb-4 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg"
            >
              <Row gutter={24}>
                <Col span={24} md={12}>
                  <Form.Item
                    label={<span className="text-white">Adult Content</span>}
                    name="adult"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      className="bg-gray-600"
                    />
                  </Form.Item>
                </Col>

                <Col span={24} md={12}>
                  <Form.Item
                    label={<span className="text-white">Has Video</span>}
                    name="video"
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      className="bg-gray-600"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>

          <div className="flex justify-between mt-8">
            <Button
              type="default"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="h-12 px-6 text-white bg-gray-700 border-gray-600 rounded-lg hover:bg-gray-600"
            >
              Back to List
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              className="h-12 px-8 border-0 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              icon={<PlusOutlined />}
            >
              Create Movie
            </Button>
          </div>
        </Form>

        {/* Modal kết quả */}
        <ResultModal />
      </div>
    </div>
  );
};

export default MovieCreate;
