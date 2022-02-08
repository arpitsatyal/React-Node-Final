import { Form, Select, Input, Radio, Button, Upload } from "antd";
import { InputNumber } from "antd";
import { MobileOutlined, HomeOutlined, BankOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { tokenProcess } from "../../utils/tokenProcess";

const { Option } = Select;

const wrapper = { margin: "50px 0px 0px 300px" };
const info = { margin: "10px 0px 20px 300px" };
const icons = { display: "block", width: "35%" };

const ContactForm = ({ slug, method, operation, validate }) => {
  const [authToken, setAuthToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [contactNumber, setContactNumber] = useState({
    mobile: "",
    work: "",
    home: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    getAllCountries();
  }, [authToken]);

  const getAllCountries = async () => {
    try {
      const { data } = await axios.get("https://restcountries.com/v3.1/all");
      const allCountries = data.map((c) => c.name.common);
      setCountries(allCountries.sort());
    } catch (e) {
      console.log(e);
    }
  };

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 6,
    },
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const onFinish = async (values) => {
    const token = await tokenProcess(setAuthToken);
    try {
      let url = "";
      method === "post"
        ? (url = process.env.REACT_APP_API)
        : (url = `${process.env.REACT_APP_API}/${slug}`);
        setSubmitting(true);
        await axios({
          method,
          url,
          data: { ...values, ...contactNumber },
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubmitting(false);
        toast.success(`Your record has been ${operation.toLowerCase()}ed.`);
        setTimeout(() => navigate("/contacts"), 3000);
    } catch (e) {
      console.log(e);
      setSubmitting(false);
      toast.error(e.response.data.err.msg);
    }
  };

  return (
    <div style={wrapper}>
      <h1 style={info}>{operation} Your Details</h1>
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          "input-number": 3,
          "checkbox-group": ["A", "B"],
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: validate ? true : false,
              message: validate ? "Please input your name!" : "",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: validate ? true : false,
              message: validate ? "Please input your email!" : "",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="country"
          label="Country"
          rules={[
            {
              required: validate ? true : false,
              message: validate ? "Please input your country!" : "",
            },
          ]}
          hasFeedback
        >
          <Select placeholder="Please select a country">
            {countries.map((name) => (
              <Option key={Math.random() * 100} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            {
              required: validate ? true : false,
              message: validate ? "Please input your address!" : "",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="prefer not to say">Prefer not to say</Radio>
          </Radio.Group>
        </Form.Item>

        <div style={{ margin: "0px 0px 30px 300px" }}>
          <InputNumber
            addonBefore={<MobileOutlined />}
            style={icons}
            placeholder="Mobile Number"
            name="mobile"
            onChange={(val) => setContactNumber(prevState => ({ ...prevState, mobile: val }))}
          />
          <InputNumber
            addonBefore={<HomeOutlined />}
            style={icons}
            placeholder="Home Number"
            name="home"
            onChange={(val) => setContactNumber(prevState => ({ ...prevState, home: val }))}
          />
          <InputNumber
            addonBefore={<BankOutlined />}
            style={icons}
            placeholder="Work Number"
            name="work"
            onChange={(val) => setContactNumber(prevState => ({ ...prevState, work: val }))}
          />
        </div>

        <Form.Item
          name="image"
          label="Image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
      <Button type="link" onClick={() => navigate("/contacts")}>
        Go Back
      </Button>
    </div>
  );
};

export default ContactForm;
