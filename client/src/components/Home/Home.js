import React, { useEffect, useState }  from 'react';
import { Breadcrumb, Space, Avatar, Layout, List, theme, Button, Popconfirm, message, Modal, Form, Input, Upload } from 'antd';
import { LikeOutlined, MessageOutlined, PlusSquareOutlined, UploadOutlined } from '@ant-design/icons';
import NavBar from '../NavBar/NavBar';
import axios from 'axios';
const { Content } = Layout;

const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );


const Home = () => {


  const cancel = (e) => {
    console.log(e);
    message.error('Click on No');
  };
     
    const [ post, setPost ] = useState([]);  //react hook 1(useState)
    const [ refresh, setRefresh ] = useState(true);
    const [ postPopup, setPostpopup] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {  //react hook 2(useEffect)
        console.log("Updated Posts:", post);
    }, [post]);  //it will retrive the updated post, it shows the side effect in console whenever it is updated
    

    useEffect( ()=>{
        axios.get('http://localhost:3003/post/getAll')
             .then(res=>{
                console.log(res.data);
                const { result } = res.data;
                setPost(result);
             })
             .catch(err=>{
                console.log(err);
             })   
    },[refresh])
  
    // Function to handle modal submission
    const handleOk = async () => {
      try {
        const values = await form.validateFields(); // Validate form fields
        const { title, description, location } = values;
            // Prepare the request body
            const body = {
              title: title,
              description: description,
              location: location,
            };
            console.log(body);

            //Axios POST request
            await axios.post('http://localhost:3003/post/create', body);
            setRefresh(prev => !prev);
            message.success('Post created successfully!');
            
            form.resetFields(); // Reset the form
            setPostpopup(false); // Close the modal
          } catch (error) {
            if (error.response) {
              console.error('Server error:', error.response);
              message.error('Failed to create the post.');
            } else {
              console.error('Validation error:', error);
            }
          }
    };
  
    const handleCancel = () => {
      form.resetFields(); // Reset form fields when modal is canceled
      setPostpopup(false); // Close the modal
    };
    
          
  
  const deletePost =async (id) =>{
      axios.delete('http://localhost:3003/post/delete/'+id)
           .then(res=>{
              setRefresh(prev => !prev);
           })
           .catch(err=>{
              console.log(err);
           })  
            
  }  
    
  const AddLike = (id,count) =>{
        const body = {
            id,
            dataToUpdate : {
                likesCount: ++count
            }    
        }
        axios.put('http://localhost:3003/post/update', body)
             .then(res =>{
                console.log(res.data);
                setRefresh(prev => !prev); //refresh= true !true
             })
             .catch(err =>{
                console.log(err);
             })   
  }  
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <NavBar/>  
      <Layout>
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        /> */}
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item><Button icon={<PlusSquareOutlined/>} type="primary" onClick={()=>{setPostpopup(true)}} >Create Post</Button></Breadcrumb.Item>
            <Breadcrumb.Item>POSTS</Breadcrumb.Item>
            
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: '100vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Modal
              title="Create Post"
              visible={postPopup}
              onOk={handleOk}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                  Submit
                </Button>,
              ]}
              width={500}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter a title!' }]}
                >
                  <Input placeholder="Enter post title" />
                </Form.Item>

                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ message: 'Please enter a description!' }]}
                >
                  <Input placeholder="Enter post description" />
                </Form.Item>

                <Form.Item
                  label="Location"
                  name="location"
                  rules={[{ required: true, message: 'Please enter a location!' }]}
                >
                  <Input placeholder="Enter post location" />
                </Form.Item>
                <Form.Item label="Upload Image" name="image">
                  <Upload beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 3,
                }}
                dataSource={post}
                footer={
                <div>
                    <b>ant design</b> footer part
                </div>
                }
                renderItem={(item) => (
                    <List.Item
                        key={item._id}
                        actions={[
                        <Button color="default" variant="link" onClick={()=>AddLike(item._id,item.likesCount)}>
                            <IconText icon={LikeOutlined} text={item.likesCount} key="list-vertical-like-o" />
                        </Button>,
                        <Button color="default" variant="link">
                            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />
                        </Button>,
                        <Button>Edit</Button>,
                        <Popconfirm
                          title="Delete the task"
                          description="Are you sure to delete this task?"
                          onConfirm={()=>deletePost(item._id)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger>Delete</Button>
                        </Popconfirm>
                        ]}
                        extra={
                        <>    
                        <img
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                        
                        </>
                        }
                    >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href={item.href}>{item.title}</a>}
                        description={item.location}
                    />
                    {item.description}
                </List.Item>
                )}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default Home;    