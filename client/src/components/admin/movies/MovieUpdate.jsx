import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Form,
    Input,
    Select,
    Button,
    InputNumber,
    Switch,
    message,
    Alert,
    Tag,
    Row,
    Col,
    Collapse,
    Modal,
    Result,
    Space,
    Spin,
} from "antd";
import {
    ArrowLeftOutlined,
    UploadOutlined,
    EditOutlined,
    PictureOutlined,
    InfoCircleOutlined,
    StarOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { updateMovie, fetchMovieById } from "../../../services/movieService";
import { fetchGetGenres } from "../../../services/MoviesApi";

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const MovieUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // Movie state
    const [movie, setMovie] = useState({
        adult: false,
        backdrop_path: "",
        genre_ids: [],
        original_language: "en",
        original_title: "",
        overview: "",
        popularity: 0,
        poster_path: "",
        release_date: "",
        title: "",
        video: false,
        vote_average: 0,
        vote_count: 0,
    });

    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [posterPreview, setPosterPreview] = useState("");
    const [backdropPreview, setBackdropPreview] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [resultStatus, setResultStatus] = useState("success");
    const [resultMessage, setResultMessage] = useState("");
    const [errorDetails, setErrorDetails] = useState("");
    const [genreList, setGenreList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch genres
                const genreList = await fetchGetGenres();
                const genreMap = genreList.reduce((acc, genre) => {
                    acc[genre.id] = genre.name;
                    return acc;
                }, {});
                setGenreList(genreMap);

                // Fetch movie data
                const movieData = await fetchMovieById(id);

                // Update movie state
                setMovie(movieData);
                setSelectedGenres(movieData.genre_ids || []);

                // Set form values
                form.setFieldsValue(movieData);

                // Set image previews
                if (movieData.poster_path) {
                    setPosterPreview(
                        movieData.poster_path.startsWith("/")
                            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                            : movieData.poster_path
                    );
                }

                if (movieData.backdrop_path) {
                    setBackdropPreview(
                        movieData.backdrop_path.startsWith("/")
                            ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}`
                            : movieData.backdrop_path
                    );
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to load movie data");
                navigate("/admin/movies");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, form, navigate]);

    const handleGenreChange = (values) => {
        setSelectedGenres(values);
        setMovie(prev => ({ ...prev, genre_ids: values }));
        form.setFieldsValue({ genre_ids: values });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMovie(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleNumberChange = (name, value) => {
        setMovie(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (name, checked) => {
        setMovie(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleDateChange = (value) => {
        setMovie(prev => ({
            ...prev,
            release_date: value
        }));
    };

    const handleImageChange = (type, value) => {
        setMovie(prev => ({
            ...prev,
            [type === 'poster' ? 'poster_path' : 'backdrop_path']: value
        }));

        if (value.startsWith("/")) {
            type === 'poster'
                ? setPosterPreview(`https://image.tmdb.org/t/p/w500${value}`)
                : setBackdropPreview(`https://image.tmdb.org/t/p/w1280${value}`);
        } else if (value) {
            type === 'poster'
                ? setPosterPreview(value)
                : setBackdropPreview(value);
        } else {
            type === 'poster'
                ? setPosterPreview("")
                : setBackdropPreview("");
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // Create the final movie object to submit
            const movieToUpdate = {
                ...movie,
                id: id // Ensure the ID is included
            };

            console.log("Submitting movie data:", movieToUpdate); // Log the movie data being submitted


            const response = await updateMovie(id, movieToUpdate);

            // Show success message
            setResultStatus("success");
            setResultMessage(`Phim "${movieToUpdate.title}" đã được cập nhật thành công!`);
            setResultModalVisible(true);
            message.success("Phim đã được cập nhật thành công!");
        } catch (error) {
            console.error("Error updating movie:", error);
            setResultStatus("error");
            setResultMessage("Không thể cập nhật phim. Vui lòng kiểm tra lại thông tin.");
            setErrorDetails(error.message || "Đã xảy ra lỗi không xác định");
            setResultModalVisible(true);
            message.error("Lỗi khi cập nhật phim: " + error.message);
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
                        <CheckCircleOutlined className="text-green-500 text-5xl" />
                    ) : (
                        <CloseCircleOutlined className="text-red-500 text-5xl" />
                    )
                }
                title={
                    <div
                        className={`text-xl font-medium ${resultStatus === "success" ? "text-green-500" : "text-red-500"
                            }`}
                    >
                        {resultStatus === "success"
                            ? "Cập nhật phim thành công!"
                            : "Cập nhật phim thất bại!"}
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
                                        className="bg-green-500 hover:bg-green-600 border-none"
                                        onClick={handleModalClose}
                                    >
                                        Quay lại danh sách phim
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        type="primary"
                                        className="bg-blue-500 hover:bg-blue-600 border-none"
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
                <Spin size="large" tip="Loading movie data..." />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen px-4 py-8 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center mb-8">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleBack}
                        className="mr-4 bg-transparent text-white border-0 hover:bg-blue-800 rounded-full p-3 flex items-center justify-center"
                    />
                    <p className="text-3xl font-bold bg-clip-text text-center flex items-center m-0 text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Update Movie
                    </p>
                </div>

                <Alert
                    message={
                        <div className="flex items-center">
                            <span className="font-bold mr-2">Movie ID:</span>
                            <span className="font-mono bg-blue-900 px-2 py-1 rounded text-white">
                                {id}
                            </span>
                        </div>
                    }
                    type="info"
                    showIcon
                    className="mb-6 border border-blue-500 bg-blue-900 bg-opacity-30 rounded-lg"
                />

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
                                        Thông tin cơ bản
                                    </span>
                                </div>
                            }
                            key="basic"
                            className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg mb-4"
                        >
                            <Row gutter={24}>
                                <Col span={24} lg={12}>
                                    <Form.Item
                                        label={<span className="text-white">Tiêu đề</span>}
                                        name="title"
                                        rules={[{ required: true, message: "Please enter title!" }]}
                                    >
                                        <Input
                                            name="title"
                                            value={movie.title}
                                            onChange={handleInputChange}
                                            placeholder="Movie title"
                                            className="bg-gray-700 text-white border-gray-600 rounded-lg h-12 hover:border-blue-500 focus:border-blue-500"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="text-white">Tiêu đề gốc</span>}
                                        name="original_title"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter original title!",
                                            },
                                        ]}
                                    >
                                        <Input
                                            name="original_title"
                                            value={movie.original_title}
                                            onChange={handleInputChange}
                                            placeholder="Original title"
                                            className="bg-gray-700 text-white border-gray-600 rounded-lg h-12 hover:border-blue-500 focus:border-blue-500"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={<span className="text-white">Giới thiệu</span>}
                                        name="overview"
                                    >
                                        <TextArea
                                            name="overview"
                                            value={movie.overview}
                                            onChange={handleInputChange}
                                            placeholder="Movie description"
                                            rows={5}
                                            className="bg-gray-700 text-white border-gray-600 rounded-lg hover:border-blue-500 focus:border-blue-500"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24} lg={12}>
                                    <Form.Item
                                        label={<span className="text-white">Ngày phát hành</span>}
                                        name="release_date"
                                    >
                                        <Input
                                            name="release_date"
                                            value={movie.release_date}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            placeholder="YYYY-MM-DD"
                                            className="bg-gray-700 text-white border-gray-600 rounded-lg h-12 hover:border-blue-500 focus:border-blue-500"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label={
                                            <span className="text-white">Ngôn ngữ gốc</span>
                                        }
                                        name="original_language"
                                    >
                                        <Select
                                            value={movie.original_language}
                                            onChange={(value) => handleInputChange({ target: { name: "original_language", value } })}
                                            placeholder="Select language"
                                            className="bg-gray-700 text-white border-gray-600 rounded-lg h-12 hover:border-blue-500"
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
                                        label={<span className="text-white">Thể loại</span>}
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
                                                value={selectedGenres}
                                                placeholder="Select movie genres"
                                                className="w-full bg-gray-700 text-white border-gray-600 rounded-lg hover:border-blue-500"
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

                        {/* Media Panel */}
                        <Panel
                            header={
                                <div className="flex items-center">
                                    <PictureOutlined className="!mr-2 !text-blue-400" />
                                    <span className="text-lg font-medium text-white">Hình ảnh</span>
                                </div>
                            }
                            key="media"
                            className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg mb-4"
                        >
                            <Row gutter={24}>
                                <Col span={24} lg={12}>
                                    <Form.Item
                                        label={<span className="text-white">Poster</span>}
                                        name="poster_path"
                                    >
                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <div
                                                    className={`bg-gray-900 border-2 border-dashed ${posterPreview
                                                        ? "border-transparent"
                                                        : "border-gray-600"
                                                        } rounded-xl overflow-hidden transition-all duration-300 h-80 flex items-center justify-center`}
                                                >
                                                    {posterPreview ? (
                                                        <img
                                                            src={posterPreview}
                                                            alt="Poster preview"
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="text-center p-6">
                                                            <UploadOutlined className="text-4xl text-gray-500 mb-3" />
                                                            <p className="text-gray-400">
                                                                Upload or paste poster URL
                                                            </p>
                                                            <p className="text-gray-500 text-sm mt-1">
                                                                Recommended size: 500x750
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                {posterPreview && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                                                value={movie.poster_path}
                                                onChange={(e) => handleImageChange('poster', e.target.value)}
                                                placeholder="Enter poster URL (or paste /path for TMDB)"
                                                className="bg-gray-700 text-white border-gray-600 rounded-lg h-12 hover:border-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>

                                <Col span={24} lg={12}>
                                    <Form.Item
                                        label={<span className="text-white">Ảnh bìa</span>}
                                        name="backdrop_path"
                                    >
                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <div
                                                    className={`bg-gray-900 border-2 border-dashed ${backdropPreview
                                                            ? "border-transparent"
                                                            : "border-gray-600"
                                                        } rounded-xl overflow-hidden transition-all duration-300 h-48 flex items-center justify-center`}
                                                >
                                                    {backdropPreview ? (
                                                        <img
                                                            src={backdropPreview}
                                                            alt="Backdrop preview"
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="text-center p-6">
                                                            <UploadOutlined className="text-4xl text-gray-500 mb-3" />
                                                            <p className="text-gray-400">
                                                                Upload or paste backdrop URL
                                                            </p>
                                                            <p className="text-gray-500 text-sm mt-1">
                                                                Recommended size: 1280x720
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                {backdropPreview && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                                                value={movie.backdrop_path}
                                                onChange={(e) => handleImageChange('backdrop', e.target.value)}

                                                placeholder="Enter backdrop URL (or paste /path for TMDB)"
                                                className="bg-gray-700 text-white border-gray-600 rounded-lg h-12 hover:border-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Panel>

                        {/* Ratings Panel */}
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
                            className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg mb-4"
                        >
                            <Row gutter={24}>
                                <Col span={24} md={8}>
                                    <Form.Item
                                        label={<span className="text-white">Popularity</span>}
                                        name="popularity"
                                    >
                                        <InputNumber
                                            value={movie.popularity}
                                            onChange={(value) => handleNumberChange('popularity', value)}
                                            placeholder="Enter popularity"
                                            min={0}
                                            step={0.1}
                                            className="w-full bg-gray-700 text-white border-gray-600 rounded-lg hover:border-blue-500 h-12"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24} md={8}>
                                    <Form.Item
                                        label={<span className="text-white">Vote Average</span>}
                                        name="vote_average"
                                    >
                                        <InputNumber
                                            value={movie.vote_average}
                                            onChange={(value) => handleNumberChange('vote_average', value)}
                                            placeholder="Enter rating"
                                            min={0}
                                            max={10}
                                            step={0.001}
                                            className="w-full bg-gray-700 text-white border-gray-600 rounded-lg hover:border-blue-500 h-12"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24} md={8}>
                                    <Form.Item
                                        label={<span className="text-white">Vote Count</span>}
                                        name="vote_count"
                                    >
                                        <InputNumber
                                            value={movie.vote_count}
                                            onChange={(value) => handleNumberChange('vote_count', value)}
                                            placeholder="Enter vote count"
                                            min={0}
                                            className="w-full bg-gray-700 text-white border-gray-600 rounded-lg hover:border-blue-500 h-12"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Panel>

                        {/* Settings Panel */}
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
                            className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg mb-4"
                        >
                            <Row gutter={24}>
                                <Col span={24} md={12}>
                                    <Form.Item
                                        label={<span className="text-white">Adult Content</span>}
                                        name="adult"
                                        valuePropName="checked"
                                    >
                                        <Switch
                                            checked={movie.adult}
                                            onChange={(checked) => handleSwitchChange('adult', checked)}
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
                                            checked={movie.video}
                                            onChange={(checked) => handleSwitchChange('video', checked)}
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                            className="bg-gray-600"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>

                    <div className="mt-8 flex justify-between">
                        <Button
                            type="default"
                            size="large"
                            icon={<ArrowLeftOutlined />}
                            onClick={handleBack}
                            className="bg-gray-700 text-white border-gray-600 rounded-lg h-12 px-6 hover:bg-gray-600"
                        >
                            Back to List
                        </Button>

                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={submitting}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-lg h-12 px-8 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                            icon={<EditOutlined />}
                        >
                            Update Movie
                        </Button>
                    </div>
                </Form>

                {/* Modal kết quả */}
                <ResultModal />
            </div>
        </div>
    );
};

export default MovieUpdate;