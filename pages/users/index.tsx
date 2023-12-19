import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { Table, DatePicker, Space, Button, Modal, Form, Input, InputNumber, Alert, Switch } from "antd";
import nookies from 'nookies'; // Make sure you've imported nookies
import axios from 'axios';
import dayjs from 'dayjs';


import { WhatsAppOutlined } from '@ant-design/icons';
type CountdownProps = {
  endTime: string;
};
type ModalType = "deposit" | "withdraw" | "duration" | "reset";
type DepositValues = {
  depositAmount: number;
};
type ResetPasswordFormValues = {
  newPassword: string;
  // Add other properties as needed
};

type WithdrawValues = {
  withdrawAmount: number;
};

type DurationValues = {
  duration: number;
};
type FormValues = DepositValues | WithdrawValues | DurationValues;
const API_BASE_URL = "https://api.play888king.com/users";


/**
 * Your JSDoc comment here...
 *
 * @param memberId - The ID of the member.
 * @param actionType - The type of action (either "deposit" or "withdraw").
 * @param amount - The amount to be deposited or withdrawn.
 */
async function sendApiRequest(memberId: string | number, actionType: "deposit" | "withdraw", amount: number | string): Promise<void> {
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

  // Construct the request URL
  const url = `${API_BASE_URL}/${memberId}/${actionType}`;

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
      method: "PATCH",
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
}
export default function UserList() {
  const translate = useTranslate();
  const { tableProps } = useTable({ syncWithLocation: true });
  const [now, setNow] = useState(new Date());
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchFullName, setSearchFullName] = useState('');
  const [searchContactNumber, setSearchContactNumber] = useState('');
  const [searchBankAccountNumber, setSearchBankAccountNumber] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);  const [isScorelogModalOpen, setIsScorelogModalOpen] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [scorelogData, setScorelogData] = useState([]);

  const handleScorelogClick = (memberId: string | number) => {
    if (typeof memberId === 'string' || typeof memberId === 'number') {
      setSelectedMemberId(memberId);
      setIsScorelogModalOpen(true);
    } else {
      // Handle the case where memberId is neither a string nor a number
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
      {
      title: 'Before Balance',
      dataIndex: 'before_balance',
      key: 'before_balance',
    },

      {
      title: 'After Balance',
      dataIndex: 'after_balance',
      key: 'after_balance',
    },
  ];

  const handleSearch = async () => {
    try {
      const fromDate = dateFrom ? (dateFrom as Date).toISOString() : '';
      const toDate = dateTo ? (dateTo as Date).toISOString() : '';
      const apiUrl = `https://cr.go888king.com/api/apollo/get-credit-log-username?credit-page=1&date_from=${fromDate}&date_to=${toDate}&username=${selectedMemberId}`;

      const response = await axios.get(apiUrl);
      if (response.status === 200) {
        setScorelogData(response.data.data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const handleSuspendToggle = async (memberId: string, checked: boolean) => {
    setIsSuspended(checked); // Update local state immediately (optional)

    try {
      const jwtTokenObject = nookies.get(null, 'jwt');
      const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';

      if (!jwtToken) {
        console.error('JWT token is missing');
        return;
      }

      await axios.put(`https://api.play888king.com/users/${memberId}/suspend`, { suspended: checked }, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to toggle suspension:', error);
    }
  };

//helper functions
const getToday = () => {
  const today = new Date();
  return { start: today, end: today };
};

const getYesterday = () => {
  const today = new Date();
  const yesterday = new Date(today.setDate(today.getDate() - 1));
  return { start: yesterday, end: yesterday };
};

const getThisWeek = () => {
  const today = new Date();
  const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const lastDayOfWeek = new Date(firstDayOfWeek.getTime());
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  return { start: firstDayOfWeek, end: lastDayOfWeek };
};

const getThisMonth = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { start: firstDayOfMonth, end: lastDayOfMonth };
};
//

  const [showNegativeAlert, setShowNegativeAlert] = useState(false);
  const handleUpdateBalances = async () => {
    const host_id = 'd2b154ee85f316a9ba2b9273eb2e3470'; // Replace with your actual host_id
    const url = `https://api.play888king.com/update-all-balances/${host_id}`; // Update with your actual API endpoint


    const jwtTokenObject = nookies.get(null, 'jwt');
    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';

    if (!jwtToken) {
      console.error('JWT token is missing');
      return;
    }

    try {
      const response = await axios.put(url, {}, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });

      console.log(response.data);
      // Update last fetched time
      setLastFetched(new Date());
      window.location.reload();

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);




  const handleKick = async (memberId: string | number) => {
    const jwtTokenObject = nookies.get(null, 'jwt');
    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';

    if (!jwtToken) {
      console.error('JWT token is missing');
      return;
    }

    try {
      await axios.post(`https://api.play888king.com/users/${memberId}/kick`, {}, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
      window.alert('User kicked successfully');

    } catch (error) {
      console.error('Failed to kick user:', error);
    }
  };



  const [modalInfo, setModalInfo] = useState<{ type: ModalType | null, visible: boolean, memberId: string | null, balance: number | null }>({
    type: null,
    visible: false,
    memberId: null,
    balance: null
  });




  const form = Form.useForm()[0];
  const showModal = (type: ModalType, memberId: string, balance: number | null = null) => {
    setModalInfo({ type, visible: true, memberId, balance });
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
    console.log("Member ID:", modalInfo.memberId);

    if (modalInfo.type === "deposit" && 'depositAmount' in values) {
      sendApiRequest(modalInfo.memberId!, modalInfo.type, values.depositAmount);
    } else if (modalInfo.type === "withdraw" && 'withdrawAmount' in values) {
      sendApiRequest(modalInfo.memberId!, modalInfo.type, values.withdrawAmount);
    }

    hideModal();
    window.location.reload();
  };



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
  const renderModalContent = () => {
    const modalType = modalInfo.type;

    if (modalType === "deposit") {
      return (
        <>
          {showAlert && <Alert message="Your input can only be in two decimals" type="error" />}
          {showNegativeAlert && <Alert message="Your input cannot be negative" type="error" />}

          <p>Current Balance: RM {modalInfo.balance?.toFixed(2) || '0.00'}</p>

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

          <p>Current Balance: RM {modalInfo.balance?.toFixed(2) || '0.00'}</p>


          <Form form={form} onFinish={handleSubmit}>
            <Form.Item name="withdrawAmount" label="Withdraw Amount" rules={[{ required: true, message: "Please enter the withdraw amount" }]}>
              <InputNumber style={{ width: '100%' }} onChange={handleInputChange} />
            </Form.Item>
          </Form>
        </>
      );
    }

    if (modalType === "duration") {
      return (
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="duration" label="Duration" rules={[{ required: true, message: "Please enter the duration" }]}>
            <Input />
          </Form.Item>
        </Form>
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


  const handleResetSubmit = (values: ResetPasswordFormValues) => {
    const newPassword = values.newPassword; // Get the new password from the form values
    
    // Check if username is not null
    if (modalInfo.memberId) {
      handleResetPassword({ memberId: modalInfo.memberId, newPassword }); // Call handleResetPassword with the new password
    } else {
      console.error('Username is null');
      // Handle the case where username is null, e.g., show an error message to the user
    }

  };

  const handleResetPassword = async (user: { memberId: string, newPassword: string }) => {
    const jwtTokenObject = nookies.get(null, 'jwt');
    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';
  
    if (!jwtToken) {
      console.error('JWT token is missing');
      return;
    }
  
    try {
      const response = await axios.post(`https://api.play888king.com/users/reset-password`, {
        memberId: user.memberId,
        newPassword: user.newPassword
      }, {
        headers: {
          "Authorization": `Bearer ${jwtToken}`
        }
      });
  
      // Handle the response
      window.alert('Password reset response:' + JSON.stringify(response.data));
    } catch (error) {
      window.alert('Failed to Reset Password: ' + error);
    }
    hideModal();
  };

  useEffect(() => {
    const host_id = 'd2b154ee85f316a9ba2b9273eb2e3470'; // Default host_id
    const url = `https://api.play888king.com/users/update-all-balances/${host_id}`; // Update with your actual API endpoint

    axios.put(url)
      .then(response => {
        console.log(response.data);
        // Here you can handle the response, for example update your state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts


  const filteredData = tableProps.dataSource && tableProps.dataSource.filter(
    record =>
      record.memberId.toLowerCase().includes(searchUsername.toLowerCase()) &&
      record.bankAccountName.toLowerCase().includes(searchFullName.toLowerCase()) &&
      record.phoneNumber.includes(searchContactNumber) &&
      record.bankAccountNumber.includes(searchBankAccountNumber)
  );

  const modalFooter = ( // Custom JSX for the modal footer
  <div>
    <button onClick={() => handleSearch()}>Search Scorelog</button>
  </div>
);


  return (
    <div>
     <Modal
  title="Scorelog"
  visible={isScorelogModalOpen}
  onCancel={() => setIsScorelogModalOpen(false)}
  onOk={handleSearch}
  footer={modalFooter}
  width={800}
  bodyStyle={{ height: '60vh', overflow: 'auto' }}
>
  <Space>
  <Button onClick={() => {
  setDateFrom(getToday().start);
  setDateTo(getToday().end);
}}>Today</Button>
  <Button onClick={() => {
  setDateFrom(getYesterday().start);
  setDateTo(getYesterday().end);
}}>Yesterday</Button>

<Button onClick={() => {
  setDateFrom(getThisWeek().start);
  setDateTo(getThisWeek().end);
}}>This Week</Button>

<Button onClick={() => {
  setDateFrom(getThisMonth().start);
  setDateTo(getThisMonth().end);
}}>This Month</Button>
  </Space>
  <DatePicker value={dateFrom ? dayjs(dateFrom) : null} onChange={date => setDateFrom(date ? date.toDate() : null)} />
  <DatePicker value={dateTo ? dayjs(dateTo) : null} onChange={date => setDateTo(date ? date.toDate() : null)} />
  <Table dataSource={scorelogData} columns={columns} />
</Modal>

      <Modal title={modalInfo.type?.toUpperCase()} visible={modalInfo.visible} onCancel={hideModal} onOk={() => form.submit()}>
        {renderModalContent()}
      </Modal>
      <Alert
        message="Before you make any deposits/withdraws, please fetch balances first here"
        type="info"
        showIcon
      />
      <Button type="primary" onClick={handleUpdateBalances}>Update Balances</Button>
      {lastFetched && <p>Last fetched time: {lastFetched.toLocaleString()}</p>}

      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Username"
          value={searchUsername}
          onChange={e => setSearchUsername(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Search Full Name"
          value={searchFullName}
          onChange={e => setSearchFullName(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Search Contact Number"
          value={searchContactNumber}
          onChange={e => setSearchContactNumber(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Input
          placeholder="Search Bank Account Number"
          value={searchBankAccountNumber}
          onChange={e => setSearchBankAccountNumber(e.target.value)}
          style={{ width: 200 }}
        />
      </div>

      <List>
  <Table
          {...tableProps}
          rowKey="id"
          dataSource={filteredData} // Use filtered data for the table
        >
          <Table.Column
            dataIndex="memberId"
            title={translate("Username")}
          />
          <Table.Column
            dataIndex="agent"
            title={translate("Agent")}
          />
          <Table.Column
            dataIndex="balance"
            title={translate("Wallet Balance")}
            render={(value: number) => value ? `RM ${value.toFixed(2)}` : 'MYR 0.00'}


          />
          <Table.Column
            dataIndex="promotionalBalance"
            title={translate("Promotional Balance")}
            render={(value: number) => value ? `RM ${value.toFixed(2)}` : 'MYR 0.00'}

          />


<Table.Column
    title={translate("Scorelog")}
    dataIndex="actions"
    render={(_, record: BaseRecord) => (
      <Button
        type="primary"
        size="small"
        onClick={() => handleScorelogClick(record.memberId)}
      >
        =
      </Button>
    )}
  />
          <Table.Column
            title={translate("Set Credit")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    showModal("deposit", record.memberId, record.balance);
                    handleUpdateBalances();
                  }}
                  style={{ backgroundColor: 'green', borderColor: 'green' }}
                >
                  Deposit
                </Button>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    showModal("withdraw", record.memberId, record.balance);
                    handleUpdateBalances();
                  }}
                  style={{ backgroundColor: 'red', borderColor: 'red' }}
                >
                  Withdraw
                </Button>
              </Space>
            )}
          />

          <Table.Column
            title={translate("Promotion Duration (Timer)")}
            key="activePromotion"
            render={(record) => {
              const { activePromotion, lastPromotionClaim } = record;
              if (activePromotion.isActive) {
                const claimDate = new Date(lastPromotionClaim);
                const endDate = new Date(claimDate.getTime() + activePromotion.promotionDuration * 24 * 60 * 60 * 1000); // Add duration days to claim date
                const diffMs = endDate.getTime() - now.getTime(); // milliseconds between now & end date
                if (diffMs < 0) {
                  return <span style={{ color: "red" }}>Promo Expired</span>;
                }
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // days

                const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                const diffSecs = Math.round(((diffMs % 86400000) % 3600000) % 60000 / 1000); // seconds

                // Determine the color based on the remaining days
                let color = "green";
                let message = "Active";
                if (diffDays < 5) {
                  color = "orange";
                }
                if (diffDays < 5) {
                  message = "Expiring";
                }

                return (
                  <>
                    <span style={{ color: color }}>{message}</span>
                    <br />
                    Remaining: {diffDays} Days {diffHrs}:{diffMins}:{diffSecs}
                  </>
                );
              } else {
                return <span style={{ color: "red" }}>Inactive</span>;
              }
            }}
          />

          <Table.Column
            dataIndex="lastPromotionClaim"
            title={translate("Last Claimed")}
            render={(date: string) => {
              const parsedDate = new Date(date);
              return parsedDate.toLocaleDateString() + ' ' + parsedDate.toLocaleTimeString();
            }}
          />

          <Table.Column
            title={translate("Last Awarded Days")}
            dataIndex="activePromotion"
            key="activePromotion"
            render={(activePromotion) => (
              <>
                {activePromotion.isActive ? (
                  <>

                    {activePromotion.promotionDuration} Days
                  </>
                ) : (
                  <span style={{ color: "red" }}>Inactive</span>
                )}
              </>
            )}
          />
          <Table.Column
            dataIndex="bank"
            title={translate("Bank")}
          />

          <Table.Column
            dataIndex="bankAccountName"
            title={translate("Full Name")}
          />

          <Table.Column
            dataIndex="bankAccountNumber"
            title={translate("Bank Account No.")}
          />

          <Table.Column
            dataIndex="phoneNumber"
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
            dataIndex="suspended"
            title={translate("Status")}
            render={(suspended: boolean, record: BaseRecord) => (
              <>
                {suspended ? "Suspended" : "Active"}
                <Switch
                  checked={suspended}
                  onChange={(checked) => handleSuspendToggle(record.memberId, checked)}
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
                onClick={() => record.memberId && handleKick(record.memberId)}
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
                    showModal("reset", record.memberId, record.balance);
                  }}
                  style={{ backgroundColor: 'green', borderColor: 'green' }}
                >
                  Manage
                </Button>
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

  const translateProps = await serverSideTranslations(
    context.locale ?? "en",
    ["common"]
  );

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/users")}`,
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
