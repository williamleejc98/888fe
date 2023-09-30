import { AntdCreateInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
export default function AgentCreate() {
  const translate = useTranslate();
  const { formProps, saveButtonProps, queryResult } = useForm();
  return (

    <Create saveButtonProps={saveButtonProps}>
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
            label={translate("PT%")}
            name={["positionTaking"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("Credit Balance")}
            name={["agentCredit"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("Password")}
            name={["password"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label={translate("Confirm Password")}
            name={["passwordRepeat"]}
            rules={[
                {
                    required: true,
                },
            ]}
        >
            <Input />
        </Form.Item>
    
        <Form.Item
            label={translate("Subdomain Prefix, xyz.play888king.com (Only chooose small letter)")}
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
            label={translate("Logo Image (Link)")}
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
            label={translate("Contact Telegram")}
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
</Create>


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
