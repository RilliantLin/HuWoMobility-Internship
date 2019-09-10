import React from 'react';
import { Input, Modal, Form, Select, Dropdown, } from 'antd';
import { FormComponentProps } from 'antd/es/form';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (
    fieldsValue: {
      create_client_name: string;
	  create_password:string;
	  create_phonenum: string;
	  create_vip_id: number;
    },
  ) => void;
  handleModalVisible: () => void;
}
/*
 checkConfirm = (rule, value, callback) => {
    const {form_create} = this.props;
    const createPsw = form_create.getFieldValue('create_password');
    if (createPsw != value) {
      callback('新密码不一致!');
    }
    else {
      callback();
    }
  }
  */
const CreateForm: React.SFC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  //----
   const componentDidMount=() => {
    this.props.getThis(this) //传this过去，是的父组件可以通过其调用方法
  };
  //----
  const okHandle = () => {
    form.validateFields((err, fieldsValue,) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  
  const checkConfirm = (rule, value, callback) => {
    const Psw = form.getFieldValue('create_password');
    if (Psw != value) {
      callback('新密码不一致!');
    }
    else {
      callback();
    }
  };
  
  return (
    <Modal
      destroyOnClose
      title="创建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名称">
        {form.getFieldDecorator('create_client_name',
		    {
            rules: [{ required: true, message: '请输入用户名称'	
					},
				   ],
            })(<Input placeholder="eg. Lily" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户密码">
        {form.getFieldDecorator('create_password',
		    {
            rules: [{ required: true, message: '请输入用户密码'		
					},
				   ],
            })(<Input placeholder="eg. AaXia23c1" />)}
      </FormItem>	

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
        {form.getFieldDecorator('confirmPassword',
		    {
            rules: [{ required: true, 
					  message: '请确认用户密码',			
					},
			       {validator: checkConfirm}      //在这里加入验证规则
				   ],
            })(<Input placeholder="eg. AaXia23c1" />)}
      </FormItem>		  
	  
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
        {form.getFieldDecorator('create_phonenum',{
            rules: [{ required: true, message: '请输入手机号码！' },
				{ pattern: /^1\d{10}$/, message: '手机号格式错误！',}],
  })(<Input placeholder="eg. 12345678911" />)}
      </FormItem>  
	  <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="权限名称">
              {form.getFieldDecorator('create_vip_id',
		    {
            rules: [{ required: true, message:'请选择权限名称'	
					},
				   ],
            })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">普通用户</Select.Option>
                  <Select.Option value="2">普通管理用户</Select.Option>
				  <Select.Option value="3">超级管理用户</Select.Option>
                </Select>,
              )}
	  </FormItem>
  
	  
    </Modal>
  );
};

export default Form.create()(CreateForm)
