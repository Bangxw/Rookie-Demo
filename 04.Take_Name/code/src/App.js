import React from 'react';
import { Card, Button, Select, Form, Input, List, InputNumber, Avatar } from 'antd';
import './App.css';
import HanziWriter from 'hanzi-writer'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: []
    }
  }

  onFinish(values) {
    const { nameTemplate, number, strokes } = values

    axios.post('http://127.0.0.1:8800/api/list', {
      number, strokes
    }).then((response) => {
      this.setState({
        data: response.data.list
      })

      // var writer = HanziWriter.create('my-writer', '王', {
      //   width: 100,
      //   height: 100,
      //   padding: 5,
      //   delayBetweenLoops: 3000
      // });

      // writer.loopCharacterAnimation()
    })
  }

  render() {
    return (
      <div className="container">
        <Card title="Default size card" type="inner"
          style={{
            width: 500,
            marginBottom: 20
          }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8, }}
            wrapperCol={{ span: 16, }}
            initialValues={{ nameTemplate: '王**', number: 10, strokes: 0 }}
            onFinish={(e) => this.onFinish(e)}
            autoComplete="off"
          >
            <Form.Item label="Template" name="nameTemplate">
              <Input placeholder="王**" />
            </Form.Item>

            <Form.Item label="Number" name="number">
              <InputNumber min={1} max={10} />
            </Form.Item>

            <Form.Item label="Max Strokes" name="strokes">
              <InputNumber min={0} max={20} />
            </Form.Item>

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
          header={<div id="my-writer">List</div>}
          bordered
          dataSource={this.state.data}
          renderItem={item =>
            <List.Item actions={[<a key="list-loadmore-edit">Add</a>]}>
              <List.Item.Meta
                title={<a href="https://ant.design">{item[0].char + item[1].char}</a>}
                description={item[0].explanation}
              />
            </List.Item>}
        />
      </div>

    );

  }
}


export default App;