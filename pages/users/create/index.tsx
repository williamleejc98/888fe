import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useTranslate } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function UserCreate() {
  const translate = useTranslate();
  const { formProps, saveButtonProps, queryResult } = useForm();

  const { selectProps: agentSelectProps } = useSelect({
    resource: "agents",
  });
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" initialValues={{ currency: 'MYR' }}>
        <Form.Item
          label={translate("Currency (We only support MYR for now.)")}
          name={["currency"]}
          rules={[
            {
              required: true,
            },
          ]}
          style={{ display: 'none' }}  // Add this line
        >
          <Input readOnly />
        <Input readOnly />
      </Form.Item>

      <Form.Item
        label={translate("Username (Your player will login with this username")}
        name={["memberId"]}
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



    </Form>
</Create >


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
