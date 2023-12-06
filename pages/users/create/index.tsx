import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useTranslate } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Checkbox, Alert, Button, Form, Input, Select } from "antd";
import { useState } from 'react';


export default function UserCreate() {
  const translate = useTranslate();
  const { formProps, saveButtonProps, queryResult } = useForm();
  const [customBank, setCustomBank] = useState(false);

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
                <Select placeholder="Pilih bank" onChange={(value) => setCustomBank(value === 'other')}>
                  <Select.Option value="maybank">MAYBANK BERHAD</Select.Option>
                  <Select.Option value="rhbBank">RHB BANK BERHAD</Select.Option>
                  <Select.Option value="cimbBank">CIMB BANK BERHAD</Select.Option>
                  <Select.Option value="hongLeongBank">HONG LEONG BANK</Select.Option>
                  <Select.Option value="publicBank">PUBLIC BANK/PUBLIC FINANCE BERHAD</Select.Option>
                  <Select.Option value="ambank">AMBANK/AMFINANCE BERHAD</Select.Option>
                  <Select.Option value="bankSimpananNational">BANK SIMPANAN NASIONAL BERHAD</Select.Option>
                  <Select.Option value="affinBank">AFFIN BANK BERHAD</Select.Option>
                  <Select.Option value="allianceBank">ALLIANCE BANK MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="uobBank">UNITED OVERSEAS BANK (MALAYSIA) BERHAD</Select.Option>
                  <Select.Option value="hsbcBank">HSBC BANK MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="standardCharteredBank">STANDARD CHARTERED BANK MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="other">Bank Lain</Select.Option>
                </Select>
              </Form.Item>
              {customBank && (
                <Form.Item name="customBank" rules={[{ required: true, message: 'Sila masukkan nama bank anda!' }]}>
                  <Input placeholder="Nama Bank" />
                </Form.Item>
              )}


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
