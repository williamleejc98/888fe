import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useTranslate } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Checkbox, Alert, Button, Form, Input, Select } from "antd";

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
        <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Sila masukkan nombor telefon anda!' }]}>
          <Input addonBefore="+6" placeholder="0108881988" />
        </Form.Item>

        <Form.Item name="bank" rules={[{ required: true, message: 'Sila pilih bank anda!' }]}>
          <Select placeholder="Pilih bank">
            <Select placeholder="Pilih bank">
              <Select.Option value="maybank">MAYBANK</Select.Option>
              <Select.Option value="hongLeongBank">HONG LEONG BANK</Select.Option>
              <Select.Option value="publicBank">PUBLIC BANK</Select.Option>
              <Select.Option value="rhbBank">RHB BANK</Select.Option>
              <Select.Option value="ocbcBank">OCBC BANK</Select.Option>
              <Select.Option value="uobBank">UOB BANK</Select.Option>
              <Select.Option value="hsbcBank">HSBC BANK</Select.Option>
              <Select.Option value="bankSimpananNational">BANK SIMPANAN NATIONAL</Select.Option>
              <Select.Option value="allianceBank">ALLIANCE BANK</Select.Option>
              <Select.Option value="affinBank">AFFIN BANK</Select.Option>
              <Select.Option value="ambank">AMBANK</Select.Option>
              <Select.Option value="agrobank">AGROBANK</Select.Option>
              <Select.Option value="cimbBank">CIMB BANK</Select.Option>
              <Select.Option value="standardCharteredBank">STANDARD CHATERED BANK</Select.Option>
              <Select.Option value="bankRakyat">BANK RAKYAT</Select.Option>
              <Select.Option value="bankIslam">BANK ISLAM</Select.Option>
            </Select>
          </Select>
        </Form.Item>
        <Form.Item name="bankAccountName" rules={[{ required: true, message: 'Sila masukkan nama akaun bank anda!' }]}>
          <Input placeholder="Nama Akaun Bank" />
        </Form.Item>
        <Form.Item name="bankAccountNumber" rules={[{ required: true, message: 'Sila masukkan nombor akaun bank anda!' }]}>
          <Input placeholder="Nombor Akaun Bank" />
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
