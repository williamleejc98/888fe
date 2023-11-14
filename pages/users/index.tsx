import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { Table, Space, Button, Modal, Form, Input, InputNumber } from "antd";
import nookies from 'nookies'; // Make sure you've imported nookies
import axios from 'axios';


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
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="depositAmount" label="Deposit Amount" rules={[{ required: true, message: "Please enter the deposit amount" }]}>
        <InputNumber min={0} precision={2} step={0.01} style={{ width: '100%' }} />
      </Form.Item>
    </Form>
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
            render={(value: number) => value ? `MYR ${value.toFixed(2)}` : 'MYR 0.00'}

            
          />
          <Table.Column
            dataIndex="promotionalBalance"
            title={translate("Promotional Balance")}
            render={(value: number) => value ? `MYR ${value.toFixed(2)}` : 'MYR 0.00'}

          />
          <Table.Column
            title={translate("Set Credit")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <Button type="primary" size="small" onClick={() => showModal("deposit", record.memberId)}>Deposit</Button>

                <Button type="primary" size="small" onClick={() => showModal("withdraw", record.memberId)}>Withdraw</Button>

              </Space>
            )}
          />

          <Table.Column
            title={translate("Promotion Duration (Timer)")}
            dataIndex="activePromotion"
            key="activePromotion"
            render={(activePromotion) => (
              <>
                {activePromotion.isActive ? (
                  <>
                    <span style={{ color: "green" }}>Active</span>
                    <br />
                    Duration: {activePromotion.promotionDuration}
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
