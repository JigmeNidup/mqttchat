import Head from "next/head";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Tooltip,
} from "antd";
import mqtt from "mqtt";
import { useEffect, useState } from "react";

export default function Home() {
  const RoomId = "firstroom";

  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState(null);
  const [User, setUser] = useState({ name: "" });

  let [Message, setMessage] = useState([]);
  const [State, setUpdateState] = useState(Math.random());

  const handleConnect = (props) => {
    const { name } = props;

    const HOST = process.env.NEXT_PUBLIC_MQTT_HOST;
    const PORT = process.env.NEXT_PUBLIC_MQTT_PORT;
    const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
    const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;

    const host = `wss://${HOST}:${PORT}/mqtt`;
    const clientId = Math.random().toString(2, 8);

    setClient(mqtt.connect(host, { clientId, username, password }));
    setUser({ name });
  };

  const handleSend = (props) => {
    const { message } = props;
    const body = JSON.stringify({ username: User.name, message: message });
    client.publish(RoomId, body);
  };

  useEffect(() => {
    if (client) {
      client.on("connect", () => {
        client.subscribe(RoomId);
        setIsConnected(true);
        message.success("connected");
      });
      client.on("message", (topic, message) => {
        if (topic === RoomId) {
          let obj = JSON.parse(message.toString());
          let temp = Message;
          temp.push(obj);
          setMessage(temp);
          setUpdateState(Math.random());
        }
      });
    }
  }, [client, Message]);

  return (
    <div>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Powered By MQTT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          padding: 15,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundImage: "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
        }}
      >
        {!isConnected ? (
          <Card
            hoverable
            title="Enter UserName"
            style={{
              borderRadius: 10,
            }}
          >
            <Form
              layout="horizontal"
              onFinish={handleConnect}
              validateMessages={{ required: "${label} is Required" }}
            >
              <Form.Item
                name="name"
                label="UserName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button htmlType="submit">Connect</Button>
              </Form.Item>
            </Form>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {isConnected ? (
              <Col span={24}>
                {State ? (
                  <Card
                    style={{
                      backgroundColor: "lightgray",
                      overflowY: "auto",
                      maxWidth: "500px",
                      height: "80vh",
                      border: "none",
                    }}
                  >
                    {Message.map((val, i) => {
                      if (val.username === User.name) {
                        //current user
                        return (
                          <div
                            style={{
                              float: "right",
                              clear: "both",
                              marginTop: 10,
                            }}
                            key={i}
                          >
                            <span
                              style={{
                                padding: 7,
                                marginRight: 5,
                                borderRadius: 10,
                                backgroundColor: "#00e600",
                              }}
                            >
                              {val.message}
                            </span>
                            <Tooltip title={val.username}>
                              <Avatar
                                style={{ backgroundColor: "#00e600" }}
                                size="default"
                              >
                                {val.username.substring(0, 2)}
                              </Avatar>
                            </Tooltip>
                          </div>
                        );
                      } else {
                        //other user
                        return (
                          <div
                            style={{
                              float: "left",
                              clear: "both",
                              marginTop: 10,
                            }}
                            key={i}
                          >
                            <Tooltip title={val.username}>
                              <Avatar
                                style={{ backgroundColor: "#6699ff" }}
                                size="default"
                              >
                                {val.username.substring(0, 2)}
                              </Avatar>
                            </Tooltip>
                            <span
                              style={{
                                padding: 7,
                                marginLeft: 5,
                                borderRadius: 10,
                                backgroundColor: "#6699ff",
                              }}
                            >
                              {val.message}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </Card>
                ) : null}
              </Col>
            ) : null}
            <Col span={24}>
              <Card
                style={{
                  maxWidth: "500px",
                  display: "grid",
                  justifyContent: "center",
                }}
              >
                <Form onFinish={handleSend} layout="inline">
                  <Form.Item name="message">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      Send
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        )}
      </main>
    </div>
  );
}
