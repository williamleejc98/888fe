import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { BaseRecord, useTranslate } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { Table, Space, Button, Modal, Form, Input } from "antd";
import nookies from 'nookies'; // Make sure you've imported nookies


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


async function sendApiRequest(memberId: string, actionType: ModalType, amount: number) {
  if (actionType !== "deposit" && actionType !== "withdraw") return;

  // Retrieve the JWT token
  const jwtTokenObject = nookies.get(null, 'jwt'); // Retrieve the JWT token object
  const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : ''; // Extract the JWT token as a string

  const url = `${API_BASE_URL}/${memberId}/${actionType}`;
  const body = {
    amount
  };

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`, // Add JWT token to the request header
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Failed with status ${response.status}`);
    }
    const responseData = await response.json();
    console.log(responseData);
    // Handle the response if needed
  } catch (error) {
    console.error("API call failed:", error);
    // Handle errors, maybe show a notification to the user
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
};

  const renderModalContent = () => {
    const modalType = modalInfo.type;

    if (modalType === "deposit") {
      return (
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="depositAmount" label="Deposit Amount" rules={[{ required: true, message: "Please enter the deposit amount" }]}>
            <Input />
          </Form.Item>
        </Form>
      );
    }

    if (modalType === "withdraw") {
      return (
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="withdrawAmount" label="Withdraw Amount" rules={[{ required: true, message: "Please enter the withdraw amount" }]}>
            <Input />
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

  return (
    <div>
      <Modal title={modalInfo.type} visible={modalInfo.visible} onCancel={hideModal} onOk={() => form.submit()}>
        {renderModalContent()}
      </Modal>

      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="currency"
            title={translate("Currency")}
          />
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
          />
          <Table.Column
            title={translate("table.actions")}
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
  title={translate("table.actions")}
  dataIndex="actions"
  render={(_, record: BaseRecord) => (
    <Space>
                   <Button type="primary" size="small" onClick={() => showModal("duration", record.memberId)}>Set Duration</Button>

    </Space>
  )}
/>
          <Table.Column
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record._id} />
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
