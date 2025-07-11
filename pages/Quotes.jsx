import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Modal, Table } from 'antd';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';

const Quotes = () => {
  const [details, setDetails] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          'https://yisee90y.api.sanity.io/v2021-06-07/data/export/production?types=quote'
        );
        if (response.data) {
          const dataArray = response.data
            .split('\n')
            .filter(Boolean)
            .map((str) => JSON.parse(str));
          setDetails(dataArray);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();
  }, [clicked]);

  console.log(details)

  const formatDate = (timestamp) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Africa/Nairobi' };
    return new Date(timestamp).toLocaleString('en-US', options);
  };
  


  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Quotes Table', 10, 10);

    const columns = [
        // { title: '_id', dataIndex: '_id', key: '_id' },
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
        // { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
        { title: 'Move Type', dataIndex: 'moveType', key: 'moveType' },
        // { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt' }, 
        { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt' },
        // Add more columns as needed
      ];

      const data = details.map(item => ({
        // _id: item._id, 
        firstName: item.firstName,
        // lastName: item.lastName,
        email: item.email,
        phone: item.phoneNumber,
        location: item.location,
        moveType: item.moveType,
        reatedAt: formatDate(item._createdAt), // Format createdAt date
        updatedAt: formatDate(item._updatedAt), // Format updatedAt date
        // Map other fields
      }));

    doc.autoTable({
      columns,
      body: data,
    });

    doc.save('quotes.pdf');
  };


  const columns = [
    // {
    //   title: 'ID',
    //   dataIndex: '_id',
    //   key: '_id',
    // },
    // {
    //   title: 'Created At',
    //   dataIndex: '_createdAt',
    //   key: '_createdAt',
    // },
    {
        title: 'Requested At',
        dataIndex: '_updatedAt',
        key: '_updatedAt',
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Bedrooms',
      dataIndex: 'bedrooms',
      key: 'bedrooms',
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Move Date',
      dataIndex: 'moveDate',
      key: 'moveDate',
    },
    {
      title: 'Move Type',
      dataIndex: 'moveType',
      key: 'moveType',
    },
  ];

  // Sort data by _createdAt in descending order
  const sortedData = [...details].sort((a, b) => new Date(b._createdAt) - new Date(a._createdAt));

  const handleLogin = (values) => {
    // Check if the password is correct
    if (values.password === 'Taylor@123') {
      setIsLoggedIn(true);
      setModalVisible(false);
    } else {
      toast.error("Incorrect Password")
    }
  };


  return (
    <div className='flex flex-row w-full h-full items-center justify-center'>
      <div className='max-w-[1240px] my-12'>
      {!isLoggedIn ? (
        <div className='flex flex-col h-screen items-center justify-center'>
            <h2 className='my-4 text-xl'>Please Login To View This Page</h2>
            <button className='px-4 py-2 text-white bg-[#DB112B] rounded-lg' type='primary' onClick={() => setModalVisible(true)}>
                Log In
            </button>
        </div>
        ) : (
          <>
            <button
              onClick={() => setClicked((prev) => !prev)}
              className='px-4 mr-4 py-2 rounded-lg bg-[#DB112B] text-white'
            >
              Get Data
            </button>
            <button onClick={generatePDF} className='px-4 py-2 rounded-lg bg-[#DB112B] text-white'>
              Generate PDF
            </button>
            <div id='table-container' className='my-4'>
              <Table dataSource={sortedData} columns={columns} scroll={{ x: true }} responsive={true} rowKey='_id' />
            </div>
          </>
        )}

        <Modal
          title='Log In'
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form onFinish={handleLogin}>
            <Form.Item
              name='password'
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder='Enter password' />
            </Form.Item>
            <Form.Item>
              <button className='px-4 py-2 text-white bg-[#DB112B] rounded-lg' type='primary' htmlType='submit'>
                Log In
              </button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Quotes;
