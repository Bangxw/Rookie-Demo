import React from 'react';
import { Card, Button, Select, Form, Input, List, InputNumber } from 'antd';
import './App.css';
import cnchar from 'cnchar';
import 'cnchar-random';
import 'cnchar-info'

let aa = '111'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: []
    }
  }

  onFinish(values) {

    const { nameTemplate, number, gender } = values

    // const names = cnchar.name(nameTemplate || '王', {
    //   number: number || 8,
    //   gender: gender || 'both',
    //   length: 2
    // });

    let libs = Array(number).fill(null)
    libs = libs.map(() => {
      return cnchar.random.word({
        number: 2,
        stroke: 5,
        trad: false,
      })
    })

    this.setState({
      data: libs
    })


    fetch('http://127.0.0.1:3288/api/list', { method: 'POST', body: {number: 5} }).then(response => response.json())
      .then(data => {
        console.log(data.list)
        console.log(data.list[0])
      })
      .catch(e => console.log("Oops, error", e))
  }

  render() {
    return (
      <div className="container">
        <Card
          title="Default size card"
          type="inner"
          style={{
            width: 500,
            marginBottom: 20
          }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8, }}
            wrapperCol={{ span: 16, }}
            initialValues={{ nameTemplate: '王**', number: 10, gender: '2' }}
            onFinish={(e) => this.onFinish(e)}
            autoComplete="off"
          >
            <Form.Item label="Username" name="nameTemplate">
              <Input placeholder="王**" />
            </Form.Item>

            <Form.Item label="Number" name="number">
              <InputNumber min={1} max={10} />
            </Form.Item>

            {/* <Form.Item label="Gender" name="gender">
              <Select>
                <Select.Option key="1" value="1">男</Select.Option>
                <Select.Option key="0" value="0">女</Select.Option>
                <Select.Option key="2" value="2">Both</Select.Option>
              </Select>
            </Form.Item> */}

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <List
          size="small"
          header={<div>List</div>}
          bordered
          dataSource={this.state.data}
          renderItem={item => <List.Item>{item}</List.Item>}
        />
      </div>

    );

  }
}


export default App;