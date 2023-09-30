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
export default function UserList() {
  const translate = useTranslate();
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (

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
    title={translate("Active Promotion")}
    dataIndex="activePromotion"
    key="activePromotion"
    render={(activePromotion) => (
      <>
        {activePromotion.isActive ? (
          <>
            <span style={{ color: 'green' }}>Active</span>
            <br />
            Duration: {activePromotion.promotionDuration}
          </>
        ) : (
          <span style={{ color: 'red' }}>Inactive</span>
        )}
      </>
    )}
  />
      
        <Table.Column
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record._id} />
              <ShowButton hideText size="small" recordItemId={record._id} />
            </Space>
          )}
        />
      </Table>
    </List>



  )
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
