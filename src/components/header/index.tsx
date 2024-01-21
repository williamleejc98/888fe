import React, { useContext, useState } from "react";
import {
  DownOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  useTranslate,
  useGetIdentity,
  useGetLocale,
} from "@refinedev/core";
import {
  Avatar,
  Button,
  Dropdown,
  Layout as AntdLayout,
  MenuProps,
  Space,
  Switch,
  theme,
  Typography,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ColorModeContext } from "../../contexts";
import { decode as jwtDecode } from "jsonwebtoken";
import nookies from "nookies";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar?: string;
  creditBalance?: number;
};

interface MyJwtPayload {
  username: string;
}

export const Header: React.FC = () => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const { token } = useToken();
  const [creditBalance, setCreditBalance] = React.useState<number | null>(
    null
  );

  const translate = useTranslate();

  const [passwordForm] = Form.useForm(); // Create a form instance

  const showChangePasswordModal = () => {
    setIsChangePasswordModalVisible(true);
  };


  // State for the modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false); // State for the change password modal

  // State for form data in the modals
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "", // Add this line
  });
  const [loading, setLoading] = useState(false);

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      setLoading(true);
      // Your code for editing user information
    } catch (error) {
      console.error("Error editing user information", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };


  const handleChangePasswordModalOk = async () => {
    try {
      await passwordForm.validateFields();
      const values = passwordForm.getFieldsValue();
  
      setLoading(true);
      const response = await fetch(
        "https://api.play888king.com/agents/change-password", // API endpoint
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include authorization headers if needed
          },
          body: JSON.stringify({
            username: user?.name,
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          }),
        }
      );
  
      if (response.ok) {
        message.success("Password changed successfully");
        passwordForm.resetFields(); // Reset form fields after successful operation
        setIsChangePasswordModalVisible(false);
      } else {
        message.error("Password change failed");
      }
    } catch (error) {
      console.error("Error changing password", error);
    } finally {
      setLoading(false);
    } 
  };
  
  const handlePasswordModalCancel = () => {
    setIsChangePasswordModalVisible(false); // Close the change password modal
  };

  React.useEffect(() => {
    const fetchCreditBalance = async () => {
      const jwt = nookies.get()["jwt"];
      if (jwt) {
        const decodedToken = jwtDecode(jwt) as MyJwtPayload;
        const username = decodedToken?.username;

        if (username) {
          const response = await fetch(
            `https://api.play888king.com/agents/username/${username}`
          );
          const data = await response.json();
          setCreditBalance(data.agentCredit);
          setUser({
            id: data._id,
            name: data.username,
            creditBalance: data.agentCredit,
          });
        }
      }
    };

    fetchCreditBalance();
  }, []);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  position: "sticky",
  top:"0",  
  zIndex: "100",
  boxShadow: "2px 2px 100px 0px #0000002e",

  };



  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        {user?.name && (
          <Space style={{ marginLeft: "8px" }} size="middle">
            <Text strong>{user.name}</Text>
            {creditBalance !== null && (
              <>
                <Text strong>
                  RM
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(creditBalance)}
                </Text>
              
                <Button
                  type="link"
                  icon={<LockOutlined />}
                  onClick={showChangePasswordModal}
                >
                  Change Password
                </Button>
              </>
            )}
          </Space>
        )}
      </Space>

      {/* Edit Account Settings Modal */}
      <Modal
        title={translate("Edit Account Settings")}
        visible={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        confirmLoading={loading}
      >
        <Form>
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Please enter your old password",
              },
            ]}
          >
            <Input.Password
              value={formData.oldPassword}
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please enter your new password",
              },
            ]}
          >
            <Input.Password
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your new password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
      title="Change Password"
      visible={isChangePasswordModalVisible}
      onOk={handleChangePasswordModalOk}
      onCancel={handlePasswordModalCancel}
      confirmLoading={loading}
    >
      <Form form={passwordForm}>
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true, message: "Please enter your old password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter your new password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your new password" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
    </AntdLayout.Header>
  );
};
