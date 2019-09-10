import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  message,
  Badge,
  Divider,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { TableListItem, TableListParams, TableListPagination } from './data';
import { Dispatch } from 'redux';
import { IStateType } from './model';
import styles from './style.less';
import UpdateForm, { IFormValsType } from './components/UpdateForm';
import CreateForm from './components/CreateForm';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

type IStatusMapType = 'default' | 'processing' | 'success' | 'error';
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  clientTableList: IStateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: Array<TableListItem>;
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    clientTableList,
    loading,
  }: {
    clientTableList: IStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    clientTableList,
    loading: loading.models.rule,
	submitting: loading.effects['form/submitAdvancedForm'],
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  //-------
  componentDidMount() {
   
    }
    
  getThis= (ref)=>{
    this.CreateForm = ref        //接收子组件this
  }
  //-------
  columns: StandardTableColumnProps[] = [
    {
      title: '用户ID',
      dataIndex: 'client_id',
    },
    {
      title: '用户名',
      dataIndex: 'client_name',
    },
	{
      title: '权限名称',
      dataIndex: 'vip_name',
    },
    {
      title: '最后登陆时间',
      dataIndex: 'last_login',
      sorter: true,
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>用户配置</a>
         
          
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'clientTableList/fetch',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'clientTableList/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'clientTableList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'clientTableList/remove',
          payload: {
            client_id: selectedRows.map(row => row.client_id), 
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        last_login: fieldsValue.last_login && fieldsValue.last_login.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'clientTableList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: IFormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { create_client_name:any,create_vip_id:any, create_password:any,create_phonenum:any,}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'clientTableList/add',
      payload: {

        create_client_name: fields.create_client_name,
        create_vip_id: fields.create_vip_id,
		create_password:fields.create_password,
		create_phonenum:fields.create_phonenum,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();

  };

  handleUpdate = (fields: IFormValsType) => {
	
    const { dispatch } = this.props;
	const {  stepFormValues } = this.state;
    dispatch({
      type: 'clientTableList/update',
      payload: {
        client_id: stepFormValues.client_id,
		update_vip_id: fields.update_vip_id,		
		update_phonenum: fields.update_phonenum,
		update_password: fields.update_password,
		delete_client_id: fields.delete_client_id,
	
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();

  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户ID">
              {getFieldDecorator('client_id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限名称">
              {getFieldDecorator('vip_id')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">普通用户</Option>
                  <Option value="2">普通管理用户</Option>
				  <Option value="3">超级管理用户</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>

              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户ID">
              {getFieldDecorator('client_id')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="权限名称">
              {getFieldDecorator('vip_id')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">普通用户</Option>
                  <Option value="2">普通管理用户</Option>
				  <Option value="3">超级管理用户</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
		</Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
		  <Col md={8} sm={24}>
            <FormItem label="手机号码">
              {getFieldDecorator('phonenum',{
                  rules: [{ required:false },
				{ pattern: /^1\d{10}$/, message: '手机号格式错误！',}],
				})(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="最后登陆日期">
              {getFieldDecorator('last_login')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />,
              )}
            </FormItem>
          </Col>
          
          
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>

            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      clientTableList: { data },
      loading,
      form,
	  form_create,
	  form_update,
    } = this.props;

    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
	  <Menu onClick={this.handleMenuClick} selectedKeys={[]}>

      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,

    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                创建用户
              </Button>
              {selectedRows.length > 0 && (
               <span>
		{/* 		 <Button>批量操作</Button> --> 
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown> */}
                </span> 
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} 
		      getThis={this.getThis} 
		  
			  />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
            form_update={form}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
