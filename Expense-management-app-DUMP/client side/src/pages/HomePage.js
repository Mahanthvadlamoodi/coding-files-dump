import React,{ useState, useEffect } from "react";
import {Modal, Form,Select, Input, message, Table , DatePicker} from 'antd';
// import { Form, Input, message } from "antd";
import {UnorderedListOutlined, AreaChartOutlined,EditOutlined,DeleteOutlined} from '@ant-design/icons' 
import Layout from "./../components/Layout/Layout";
import axios from 'axios';
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

// import { getAllTransection } from "../../../controllers/transectionCtrl";

const HomePage = () => {
  const [showModal,setShowModal]= useState(false);
  const [loading,setLoading]=useState(false);
  const [allTransection,setAllTransection] = useState([]);
  const [frequency,setFrequency] =useState("7")
  const [selectedDate,setSelecteddate] =  useState([]);
  const [type,setType] = useState('all')
  const [viewData,setViewdata] = useState('table');
  const [editable,setEditable] = useState(null);

  //table data
  const columns = [
    {
      title:'Date',
      dataIndex:'date',
      render :(text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title:'Amount',
      dataIndex:'amount',
    },
    {
      title:'Type',
      dataIndex:'type',
    },
    {
      title:'Category',
      dataIndex:'category',
    },
    {
      title:'Reference',
      dataIndex:'refrence',
    },
    {
      title:'Actions',
      render : (text,record) => (
        <div>
          <EditOutlined onClick={() => {
            setEditable(record);
            setShowModal(true);
          }} />
          <DeleteOutlined className="mx-2" 
            onClick={() => {handleDelete(record);
            }} 
          />
        </div>
      ),
    },
  ]
  

  //useEffect Hook
  useEffect(() => {
    const getAlltransactions = async() =>{
      try {
        const user=JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res=await axios.post("/api/v1/transections/get-transection",{userid:user._id,frequency,selectedDate,type,});
        
        setAllTransection(res.data);
        setLoading(false);
        //console.log(res.data);
        
        // console.log("fetch sucess");
      } catch (error) {
        message.error("Fetch issue with transaction")
      }
    };
    getAlltransactions();
  }, [frequency, selectedDate, type, setAllTransection]);

  const handleDelete = async(record) => {
    try {
       await axios.post("/api/v1/transections/delete-transection",{transacationId:record._id,})
       setLoading(false);
       message.success("Transaction Deleted successfully");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error('unable to delete');
      
    }
  };
  //form handling
  const handleSubmit = async(values) => {
    try {
      const user=JSON.parse(localStorage.getItem('user'));
      setLoading(true);
      if(editable){
        await axios.post('/api/v1/transections/edit-transection',{payload:{...values,userId: user._id,},transacationId: editable._id,});
      setLoading(false)
      message.success('Transaction edited successfully');
      }else{
        await axios.post('/api/v1/transections/add-transection',{...values,userid: user._id,});
      setLoading(false);
      message.success('Transaction added successfully');
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error('Failed to add transaction');
    }
  }
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
          <div>
            <h6>Select Frequency</h6>
            <Select value={frequency} onChange={(values) => setFrequency(values)}>
              <Select.Option value="7">LAST 1 Week</Select.Option>
              <Select.Option value="30">LAST 1 Month</Select.Option>
              <Select.Option value="365">LAST 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {frequency ==="custom" && (
              <RangePicker 
                value={selectedDate} 
                onChange={(values) => setSelecteddate(values)}
              />
            )}
          </div>
          <div>
            <h6>Select Type</h6>
            <Select value={type} onChange={(values) => setType(values)}>
              <Select.Option value="all">ALL</Select.Option>
              <Select.Option value="income">INCOME</Select.Option>
              <Select.Option value="expense">EXPENSE</Select.Option>
            </Select>
            {frequency ==="custom" && (
              <RangePicker 
                value={selectedDate} 
                onChange={(values) => setSelecteddate(values)}
              />
            )}
          </div>
          <div className="switch-icons">
              <UnorderedListOutlined className={`mx-2 ${viewData === 'table'?'active-icon':'inactive-icon'}`} onClick={() => setViewdata('table')} />
              <AreaChartOutlined className={`mx-2 ${viewData === 'analytics'?'active-icon':'inactive-icon'}`} onClick={() => setViewdata('analytics')} />
            </div>
          <div>
            
            <button className="btn btn-primary" onClick={()=>setShowModal(true)}>Add New</button>
          </div>
      </div>
      <div className="content">
        {viewData ==='table'? <Table columns={columns} dataSource={allTransection} />:<Analytics allTransection={allTransection}/>}
        
      </div>
      <Modal title={editable ? "Edit Transaction" : "Add Transaction"} open={showModal} onCancel={()=>setShowModal(false)} footer={false} >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Amount" name="amount">
            <Input type="text"/>
          </Form.Item>
          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">tip</Select.Option>
              <Select.Option value="project">project</Select.Option>
              <Select.Option value="food">food</Select.Option>
              <Select.Option value="fees">fees</Select.Option>
              <Select.Option value="travel">travel</Select.Option>
              <Select.Option value="movies">movies</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date"/>
          </Form.Item>
          <Form.Item label="Reference" name="refrence">
            <Input type="text"/>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text"/>
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary">SAVE</button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
