import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, BaseRecord, useTranslate, useMany } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Table, Space, Modal, Form, Input, Button, InputNumber, Alert, Switch } from "antd";
import nookies from 'nookies';
import axios from 'axios';
import { WhatsAppOutlined } from '@ant-design/icons';

const API_BASE_URL = "https://api.play888king.com/agents";  // Update the endpoint as needed

type ModalType = "deposit" | "withdraw" | "duration" | "reset";
type FormValues = {
  depositAmount?: number;
  withdrawAmount?: number;
  duration?: number;
};

type ResetPasswordFormValues = {
  newPassword: string;
  // Add other properties as needed
};

export default function AgentList() {
  const translate = useTranslate();
  const { tableProps } = useTable({ syncWithLocation: true });
  const [agents, setAgents] = useState<BaseRecord[]>([]);
  const [isSuspended, setIsSuspended] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchSubdomain, setSearchSubdomain] = useState('');
  const [searchCompanyName, setSearchCompanyName] = useState('');
  const [searchContactNumber, setSearchContactNumber] = useState('');
  const [searchTelegram, setSearchTelegram] = useState('');

  const [modalInfo, setModalInfo] = useState<{ type: ModalType | null, visible: boolean, username: string | null }>({
    type: null,
    visible: false,
    username: null
  });
  useEffect(() => {
    const host_id = 'd2b154ee85f316a9ba2b9273eb2e3470'; // Default host_id
    const url = `https://api.play888king.com/agents/update-credit/${host_id}`; // Update with your actual API endpoint

    axios.put(url)
      .then(response => {
        console.log(response.data);
        // Here you can handle the response, for example update your state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts
  const refreshBalance = () => {
    const host_id = 'd2b154ee85f316a9ba2b9273eb2e3470'; // Default host_id
    const url = `https://api.play888king.com/agents/update-credit/${host_id}`; // Update with your actual API endpoint

    axios.put(url)
      .then(response => {
        console.log(response.data);
        // Here you can handle the response, for example update your state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  const refetchAgent = async (username: string) => {
    try {
      // Construct the request URL to get a single agent by its ID
      const url = `${API_BASE_URL}/username/${username}`;

      // Send the request
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(`Failed with status ${response.status}: ${JSON.stringify(responseData)}`);
      }

      const agent = await response.json();

      // Update the agents state
      setAgents(prevAgents => {
        return prevAgents.map(a => a._id === username ? agent : a);
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('API call failed:', error.message);
      } else {
        console.error('API call failed:', error);
      }
    }

  }

  useEffect(() => {
    refreshBalance();
  }, []); // Empty dependency array means this effect runs once when the component mounts



  /**
   * Sends an API request to update the balance.
   *
   * @param {string} username - The ID of the member.
   * @param {string} actionType - The type of action (deposit or withdraw).
   * @param {number | string} amount - The amount to be deposited or withdrawn.
   */
  async function sendApiRequest(username: string, actionType: "deposit" | "withdraw", amount: number | string) {
    // Ensure valid action type
    if (actionType !== "deposit" && actionType !== "withdraw") {
      console.error('Invalid actionType:', actionType);
      return;
    }

    // Convert amount to a number if it's a string
    if (typeof amount === "string") {
      amount = parseFloat(amount);
    }

    // Ensure valid amount after conversion
    if (isNaN(amount) || typeof amount !== "number") {
      console.error('Invalid amount:', amount);
      return;
    }

    // Rest of your function...



    // Construct the request URL
    const url = `${API_BASE_URL}/${actionType}/${username}`;

    // Fetch the JWT token
    const jwtTokenObject = nookies.get(null, 'jwt');
    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';

    // Ensure JWT token is available
    if (!jwtToken) {
      console.error('JWT token is missing');
      return;
    }

    // Construct the request body
    const body = {
      amount
    };

    // Send the request
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(`Failed with status ${response.status}: ${JSON.stringify(responseData)}`);
      }

      const responseData = await response.json();
      console.log('Server Response:', responseData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('API call failed:', error.message);
      } else {
        console.error('API call failed:', error);
      }
    }

    refetchAgent(username);

  }


  const form = Form.useForm()[0];
  const showModal = (type: ModalType, username: string) => {
    setModalInfo({ type, visible: true, username });
  };
  const hideModal = () => {
    setModalInfo(prev => ({ ...prev, visible: false }));
    form.resetFields();
  };
  const handleSubmit = (values: FormValues) => {
    if (showAlert) {
      Modal.error({
        title: 'Input Error',
        content: 'Your input can only be in two decimals',
      });
      return;
    }

    // Add this condition
    if (showNegativeAlert) {
      Modal.error({
        title: 'Input Error',
        content: 'Your input cannot be negative',
      }); return;
    }

    console.log(`${modalInfo.type} form values:`, values);
    console.log("Username:", modalInfo.username);
    if (modalInfo.username) {
      if (modalInfo.type === "deposit" && 'depositAmount' in values) {
        sendApiRequest(modalInfo.username, modalInfo.type, values.depositAmount || 0);
      } else if (modalInfo.type === "withdraw" && 'withdrawAmount' in values) {
        sendApiRequest(modalInfo.username, modalInfo.type, values.withdrawAmount || 0);
      }
    } else {
      console.error('Username is missing');
    }

    hideModal();
    window.location.reload();

  };
  const [showAlert, setShowAlert] = useState(false);
  const [showNegativeAlert, setShowNegativeAlert] = useState(false);
  const handleInputChange = (value: number | 0 | null) => {
    if (value === null) {
      setShowAlert(false);
      setShowNegativeAlert(false);
      return;
    }
    const decimal = value.toString().split('.')[1];
    if (decimal && decimal.length > 2) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
    if (value < 0) {
      setShowNegativeAlert(true);
    } else {
      setShowNegativeAlert(false);
    }
  };



  const handleSuspendToggle = async (username: string, checked: boolean) => {
    setIsSuspended(checked); // Update local state immediately (optional)

    try {
      const jwtTokenObject = nookies.get(null, 'jwt');
      const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';

      if (!jwtToken) {
        console.error('JWT token is missing');
        return;
      }

      await axios.put(`https://api.play888king.com/agents/${username}/suspend`, { suspended: checked }, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to toggle suspension:', error);
    }
  };


  const handleKick = async (username: string | number) => {
    const jwtTokenObject = nookies.get(null, 'jwt');
    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';

    if (!jwtToken) {
      console.error('JWT token is missing');
      return;
    }

    try {
      await axios.post(`https://api.play888king.com/agents/${username}/kick`, {}, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
      window.alert('User kicked successfully');

    } catch (error) {
      console.error('Failed to kick user:', error);
    }
  };

  const handleResetSubmit = (values: ResetPasswordFormValues) => {
    const newPassword = values.newPassword; // Get the new password from the form values
    
    // Check if username is not null
    if (modalInfo.username) {
      handleResetPassword({ username: modalInfo.username, newPassword }); // Call handleResetPassword with the new password
    } else {
      console.error('Username is null');
      // Handle the case where username is null, e.g., show an error message to the user
    }
  };

  const handleResetPassword = async (user: { username: string, newPassword: string }) => {
    const jwtTokenObject = nookies.get(null, 'jwt');
    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';
  
    if (!jwtToken) {
      console.error('JWT token is missing');
      return;
    }
  
    try {
      const response = await axios.post(`https://api.play888king.com/agents/reset-password`, {
        username: user.username,
        newPassword: user.newPassword
      }, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
  
      //
      // Handle the response
      window.alert('Password reset response:' + JSON.stringify(response.data));
    } catch (error) {
      window.alert('Failed to Reset Password:', error');
    }
    hideModal();
  };
  
  

  const renderModalContent = () => {

    const modalType = modalInfo.type;

    if (modalType === "deposit") {
      return (
        <>
          {showAlert && <Alert message="Your input can only be in two decimals" type="error" />}
          {showNegativeAlert && <Alert message="Your input cannot be negative" type="error" />}

          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="depositAmount" label="Deposit Amount" rules={[{ required: true, message: "Please enter the deposit amount" }]}>
              <InputNumber style={{ width: '100%' }} onChange={handleInputChange} />
            </Form.Item>
          </Form>
        </>
      );
    }

    if (modalType === "withdraw") {
      return (
        <>
          {showAlert && <Alert message="Your input can only be in two decimals" type="error" />}
          {showNegativeAlert && <Alert message="Your input cannot be negative" type="error" />}

          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="withdrawAmount" label="Withdraw Amount" rules={[{ required: true, message: "Please enter the withdraw amount" }]}>
              <InputNumber style={{ width: '100%' }} onChange={handleInputChange} />
            </Form.Item>
          </Form>
        </>
      );
    }

    if (modalType === "reset") {
      return (
        <>
          <p>Set new Password</p>
          <Form form={form} onFinish={handleResetSubmit}>
            <Form.Item name="newPassword" label="New Password" rules={[{ required: true, message: "Please enter the new password" }]}>
              <Input type="password" />
            </Form.Item>
          </Form>
        </>
      );
    }

    return null;
  };


  // Filter function for agents
  const filteredData = tableProps.dataSource && tableProps.dataSource.filter(
    record =>
      record.username.toLowerCase().includes(searchUsername.toLowerCase()) &&
      record.subdomain.toLowerCase().includes(searchSubdomain.toLowerCase()) &&
      record.companyName.toLowerCase().includes(searchCompanyName.toLowerCase()) &&
      record.contactNumber && record.contactNumber.includes(searchContactNumber) &&
      record.contactTelegram && record.contactTelegram.toLowerCase().includes(searchTelegram.toLowerCase())
  );







  return (
    <div>
      <Modal title={modalInfo.type} visible={modalInfo.visible} onCancel={hideModal} onOk={() => form.submit()}>
        {renderModalContent()}
      </Modal>
      <Button type="primary" onClick={refreshBalance}>Refresh Balance</Button>

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Username"
          value={searchUsername}
          onChange={e => setSearchUsername(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Search Subdomain"
          value={searchSubdomain}
          onChange={e => setSearchSubdomain(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Search Company Name"
          value={searchCompanyName}
          onChange={e => setSearchCompanyName(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Search Contact Number"
          value={searchContactNumber}
          onChange={e => setSearchContactNumber(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Search Telegram"
          value={searchTelegram}
          onChange={e => setSearchTelegram(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      <List>
        <Table dataSource={filteredData} rowKey="_id">
          <Table.Column
            dataIndex="username"
            title={translate("Username")}
          />
          <Table.Column
            dataIndex="agentUplineUsername"
            title={translate("Upline Agent")}
          />
          <Table.Column
            dataIndex="agentCredit"
            title={translate("Credits")}
            render={(value: number) => `MYR ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          />
          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <Button type="primary" size="small" onClick={() => showModal("deposit", record.username)}>Deposit</Button>
                <Button type="primary" size="small" onClick={() => showModal("withdraw", record.username)}>Withdraw</Button>
              </Space>
            )}
          />

          <Table.Column
            dataIndex="subdomain"
            title={translate("Subdomain")}
          />
          <Table.Column
            dataIndex="logoImage"
            title={translate("Logo")}
            render={(filePath: string) => (
              <img src={`https://api.play888king.com/${filePath}`} alt="Logo" style={{ width: '50px', height: '50px' }} />
            )}
          />
          <Table.Column
            dataIndex="companyName"
            title={translate("Company Name")}
          />
          <Table.Column
            dataIndex="contactNumber"
            title={translate("Whatsapp Contact Number")}
            render={(phoneNumber: string) => {
              const whatsappUrl = `https://wa.me/+6${phoneNumber}`;
              return (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button type="primary" icon={<WhatsAppOutlined />} style={{ backgroundColor: 'limegreen', borderColor: 'limegreen' }}>
                    +6{phoneNumber}
                  </Button>
                </a>
              );
            }}
          />

          <Table.Column
            dataIndex="contactTelegram"
            title={translate("Telegram")}
          />


          <Table.Column
            dataIndex="suspended"
            title={translate("Status")}
            render={(suspended: boolean, record: BaseRecord) => (
              <>
                {suspended ? "Suspended" : "Active"}
                <Switch
                  checked={suspended}
                  onChange={(checked) => handleSuspendToggle(record.username, checked)}
                />
                <span style={{ marginLeft: '8px' }}>Suspend</span>
              </>
            )}
          />

          <Table.Column
            title={translate("Kick User")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Button
                type="primary"
                size="small"
                onClick={() => record.username && handleKick(record.username)}
              >
                Kick User
              </Button>
            )}
          />

          <Table.Column
            title={translate("Reset Access")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    showModal("reset", record.username);
                  }}
                  style={{ backgroundColor: 'green', borderColor: 'green' }}
                >
                  Manage
                </Button>
              </Space>
            )}
          />


          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>

                <EditButton
                  hideText
                  size="small"
                  recordItemId={record._id}
                />
              </Space>
            )}
          />
        </Table>
      </List>
    </div>

  );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/agents")}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
