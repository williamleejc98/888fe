import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import {
  IResourceComponentsProps,
  BaseRecord,
  useTranslate,
  useMany,
} from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  MarkdownField,
  DateField,
} from "@refinedev/antd";
import { Table, Space } from "antd";
export default function AgentList() {
  const translate = useTranslate();
    const { tableProps } = useTable({
        syncWithLocation: true,
    });



  return (

    <List>
    <Table {...tableProps} rowKey="_id">
        <Table.Column
            dataIndex="username"
            title={translate("Username")}
        />
        <Table.Column
            dataIndex="positionTaking"
            title={translate("PT%")}
        />
        <Table.Column
            dataIndex="agentCredit"
            title={translate("Credits")}
        />
        <Table.Column
            dataIndex="agentUplineUsername"
            title={translate("Upline Agent")}
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
                    <ShowButton
                        hideText
                        size="small"
                        recordItemId={record._id}
                    />
                </Space>
            )}
        />
    </Table>
</List>

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
