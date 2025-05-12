import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams(); // 获取路由中的分类ID（编辑模式时存在）
  const [form] = Form.useForm();  
  const [isEditMode, setIsEditMode] = useState(false); // 是否为编辑模式

  // 初始化：如果有 categoryId 则进入编辑模式
  useEffect(() => {
    if (categoryId) {
      setIsEditMode(true);
      // 获取分类详情并填充表单
      axios.get(`http://localhost:3001/api/category-types`, {
        params: {
          typeId: categoryId
        }
      })
        .then(res => {
          form.setFieldsValue({
            TypeName: res.data.TypeName
          });
        })
        .catch(err => {
          message.error('获取分类信息失败');
          navigate('/adminPage');
        });
    }
  }, [categoryId, form, navigate]);

  const onFinish = async (values) => {
    try {
      let response;
      if (isEditMode) {
        // 编辑模式：发送PUT请求更新分类
        response = await axios.put(`http://localhost:3001/api/category/update?typeId=${categoryId}`, values);
      } else {
        // 添加模式：发送POST请求创建分类
        response = await axios.post('http://localhost:3001/api/category-type', values);
      }

      if (response.status == 200) {
        message.success(isEditMode ? '分类修改成功' : '分类添加成功');
        navigate('/adminPage');
      } else {
        message.error(response.data.msg || (isEditMode ? '分类修改失败' : '分类添加失败'));
      }
    } catch (err) {
      message.error(err.response.data.error);
      console.error(isEditMode ? '编辑分类错误' : '添加分类错误', err.response.data.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {isEditMode ? '编辑分类' : '添加新分类'}
      </h2>
      
      <Form
        form={form}
        name="addCategory"
        layout="vertical"
        onFinish={onFinish}
        requiredMark="optional"
        className="space-y-4"
      >
        {/* 分类名称 */}
        <Form.Item
          name="TypeName"
          label="分类名称"
          rules={[{ required: true, message: '请输入分类名称' }]}
        >
          <Input placeholder="输入分类名称" />
        </Form.Item>

        {/* 提交按钮 */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full"
            style={{ height: '40px' }}
          >
            {isEditMode ? '提交修改' : '提交添加'}
          </Button>
          <Button 
            type="default" 
            htmlType="button"   
            className="w-full"
            style={{ height: '40px' }}
            onClick={() => navigate(-1)}
          >
            返回上一页
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductPage;