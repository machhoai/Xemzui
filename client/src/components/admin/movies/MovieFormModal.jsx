import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const MovieFormModal = ({ isOpen, onClose, onSubmit, movie }) => {
  const [form] = Form.useForm();

  // Đặt giá trị ban đầu cho form nếu đang sửa phim
  React.useEffect(() => {
    if (movie) {
      form.setFieldsValue({
        title: movie.title,
        genre: movie.genre,
      });
    } else {
      form.resetFields();
    }
  }, [movie, form]);

  const handleSubmit = (values) => {
    onSubmit({ ...values, _id: movie?._id });
    onClose();
  };

  return (
    <Modal
      title={movie ? 'Sửa phim' : 'Thêm phim'}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="p-4"
      >
        <Form.Item
          label="Tên phim"
          name="title"
          rules={[{ required: true, message: 'Vui lòng nhập tên phim!' }]}
        >
          <Input placeholder="Nhập tên phim" />
        </Form.Item>
        <Form.Item
          label="Thể loại"
          name="genre"
          rules={[{ required: true, message: 'Vui lòng nhập thể loại!' }]}
        >
          <Input placeholder="Nhập thể loại" />
        </Form.Item>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            {movie ? 'Cập nhật' : 'Thêm'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default MovieFormModal;