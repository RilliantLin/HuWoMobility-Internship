import React, { Component,Fragment } from 'react';
import { Input, Select, Button, DatePicker, Form, Modal, Steps, Radio, Checkbox, Divider } from 'antd';
import { TableListItem } from '../data';
import { FormComponentProps } from 'antd/es/form';

export type IFormValsType = {


  update_phonenum?: string,
  update_password?: string,
  update_vip_id?: number,
  vip_id?:number,
  key?: string,

} & Partial<TableListItem>;

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: IFormValsType) => void;
  handleUpdate: (values: IFormValsType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

export interface UpdateFormState {
  formVals: IFormValsType;
  currentStep: number;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  constructor(props: UpdateFormProps) {
    super(props);

    this.state = {
      formVals: {
		
		
        update_phonenum: props.values.update_phonenum,
        update_password: props.values.update_password,
		update_vip_id: props.values.update_vip_id,		
		key:props.values.key,
		vip_id: props.values.vip_id,
		phonenum: props.values.phonenum,
		password: props.values.password,

      },
      currentStep: 0,
    };
  }

  handleNext = (currentStep: number) => {
    const { form_update, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form_update.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 0) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        },
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep: number, formVals: IFormValsType) => {
    const { form_update } = this.props;
    if (currentStep === 0) {
      return [
        
        <FormItem key="update_vip_id" {...this.formLayout} label="更改用户权限">
          {form_update.getFieldDecorator('update_vip_id', {
            initialValue: formVals.vip_id,
          })(
            <RadioGroup>
              <Radio value="1">普通用户</Radio>
              <Radio value="2">普通管理用户</Radio>
			  <Radio value="3">超级管理用户</Radio>
            </RadioGroup>,
          )}
        </FormItem>,
			<FormItem key="update_phonenum" {...this.formLayout} label="更改手机号码">
				{form_update.getFieldDecorator('update_phonenum',{
            rules: [{ required:false },
				{ pattern: /^1\d{10}$/, message: '手机号格式错误！',}],
				})(<Input placeholder="新的手机号码" />)}
			</FormItem>,
			<FormItem key="update_password" {...this.formLayout} label="更改用户密码">
				{form_update.getFieldDecorator('update_password', {
					initialValue: formVals.password,
				})(<Input placeholder="新的用户密码" />)}
			</FormItem>,

		<FormItem><Divider/></FormItem>,
        <FormItem key="delete_client_id" {...this.formLayout} label="删除该用户">
          {form_update.getFieldDecorator('delete_client_id', {
 
          })(
			<Checkbox value="1">是</Checkbox>
          )}
        </FormItem>,			
      ];
    }

  };

  renderFooter = (currentStep: number) => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          确认
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          确认
        </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="用户配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >

        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

export default UpdateForm;
