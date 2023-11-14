import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { Table, Space, Button, Modal, Form, Input, InputNumber, Alert } from "antd";
import nookies from 'nookies'; // Make sure you've imported nookies
import axios from 'axios';

import { WhatsAppOutlined } from '@ant-design/icons';
type CountdownProps = {
  endTime: string;
};
type ModalType = "deposit" | "withdraw" | "duration";
type DepositValues = {
  depositAmount: number;
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

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [modalInfo, setModalInfo] = useState<{ type: ModalType | null, visible: boolean, memberId: string | null }>({
    type: null,
    visible: false,
    memberId: null
  });



 
  const form = Form.useForm()[0];
  const showModal = (type: ModalType, memberId: string) => {
    setModalInfo({ type, visible: true, memberId });
  };
  const hideModal = () => {
    setModalInfo(prev => ({ ...prev, visible: false }));
    form.resetFields();
  };
  const handleSubmit = (values: FormValues) => {
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

  const renderModalContent = () => {
    const modalType = modalInfo.type;

if (modalType === "deposit") {
  return (
    <>
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="depositAmount" label="Deposit Amount" rules={[{ required: true, message: "Please enter the deposit amount" }]}>
        <InputNumber min={0} precision={2} step={0.01} style={{ width: '100%' }} formatter={value => `RM ${value}`} parser={value => value?.replace('RM ', '') || ''} />
      </Form.Item>
    </Form>
    <Alert message="Please make sure there is enough credit in your account" type="info" showIcon />
  </>
  );
}

if (modalType === "withdraw") {
  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="withdrawAmount" label="Withdraw Amount" rules={[{ required: true, message: "Please enter the withdraw amount" }]}>
        <InputNumber min={0} precision={2} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
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

    return null;
  };

  useEffect(() => {
    const host_id = 'd2b154ee85f316a9ba2b9273eb2e3470'; // Default host_id
    const url = `https://api.play888king.com/update-all-balances/${host_id}`; // Update with your actual API endpoint
  
    axios.put(url)
      .then(response => {
        console.log(response.data);
        // Here you can handle the response, for example update your state
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  
  return (
    <div>
      <Modal title={modalInfo.type} visible={modalInfo.visible} onCancel={hideModal} onOk={() => form.submit()}>
        {renderModalContent()}
      </Modal>

      <List>
        <Table {...tableProps} rowKey="id">

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
            title={translate("Set Credit")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
      <Button type="primary" size="small" onClick={() => showModal("deposit", record.memberId)} style={{ backgroundColor: 'green', borderColor: 'green' }}>Deposit</Button>
      <Button type="primary" size="small" onClick={() => showModal("withdraw", record.memberId)} style={{ backgroundColor: 'red', borderColor: 'red' }}>Withdraw</Button>
    </Space>
            )}
          />

<Table.Column
  title={translate("Promotion Duration (Timer)")}
  dataIndex={null}
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
  title={translate("Phone")}
  render={(phoneNumber: string) => {
    const whatsappUrl = `https://wa.me/+60${phoneNumber}`;
    return (
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button type="primary" icon={<WhatsAppOutlined />} style={{ backgroundColor: 'limegreen', borderColor: 'limegreen' }}>
          +60{phoneNumber}
        </Button>
      </a>
    );
  }}
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
