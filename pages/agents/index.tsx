import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, BaseRecord, useTranslate, useMany } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Table, Space, Modal, Form, Input, Button } from "antd";
import nookies from 'nookies';

const API_BASE_URL = "https://api.play888king.com/agents";  // Update the endpoint as needed

type ModalType = "deposit" | "withdraw" | "duration";
type FormValues = {
  depositAmount?: number;
  withdrawAmount?: number;
  duration?: number;
};


export default function AgentList() {
  const translate = useTranslate();
  const { tableProps } = useTable({ syncWithLocation: true });
  const [agents, setAgents] = useState<BaseRecord[]>([]);
  
  const [modalInfo, setModalInfo] = useState<{ type: ModalType | null, visible: boolean, username: string | null }>({
    type: null,
    visible: false,
    username: null
  });
  

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
    console.log(`${modalInfo.type} form values:`, values);
    console.log("Username:", modalInfo.username);

    if (modalInfo.type === "deposit" && 'depositAmount' in values) {
      sendApiRequest(modalInfo.username!, modalInfo.type, values.depositAmount || 0);
    } else if (modalInfo.type === "withdraw" && 'withdrawAmount' in values) {
      sendApiRequest(modalInfo.username!, modalInfo.type, values.depositAmount || 0);
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
      <Table dataSource={agents} {...tableProps} rowKey="_id">
          <Table.Column
            dataIndex="username"
            title={translate("Username")}
          />
          <Table.Column
            dataIndex="positionTaking"
            title={translate("PT%")}
          />
          <Table.Column
            dataIndex="agentUplineUsername"
            title={translate("Upline Agent")}
          />
          <Table.Column
            dataIndex="agentCredit"
            title={translate("Credits")}
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
        />
        <Table.Column
          dataIndex="companyName"
          title={translate("Company Name")}
        />
        <Table.Column
          dataIndex="contactEmail"
          title={translate("Email")}
        />
        <Table.Column
          dataIndex="contactTelegram"
          title={translate("Telegram")}
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