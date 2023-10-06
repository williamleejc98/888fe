import { AntdEditInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const AgentEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { formProps, saveButtonProps, queryResult } = useForm();
  const agentsData = queryResult?.data?.data;
  return (

    <Edit saveButtonProps={saveButtonProps}>
    <Form {...formProps} layout="vertical">
        <Form.Item
            label={translate("Contact Person")}
            name={["contactPerson"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("Username")}
            name={["username"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
    
        <Form.Item
            label={translate("Subdomain (XYZ.PLAY888KING.COM)")}
            name={["subdomain"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("Logo")}
            name={["logoImage"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("Company Name")}
            name={["companyName"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("Contact Email")}
            name={["contactEmail"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("@Telegram")}
            name={["contactTelegram"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
     
    </Form>
</Edit>
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


export default AgentEdit;
