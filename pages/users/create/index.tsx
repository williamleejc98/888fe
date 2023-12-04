import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useTranslate } from "@refinedev/core";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Checkbox, Alert, Button, Form, Input, Select } from "antd";

export default function UserCreate({subdomain}) {
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
          <Input addonBefore={subdomain} />
        </Form.Item>
        <Form.Item name="phoneNumber" rules={[{ required: true, message: 'Sila masukkan nombor telefon anda!' }]}>
          <Input addonBefore="+6" placeholder="0108881988" />
        </Form.Item>

        <Form.Item name="bank" rules={[{ required: true, message: 'Sila pilih bank anda!' }]}>
          <Select placeholder="Pilih bank">
          <Select.Option value="affinBank">AFFIN BANK BERHAD</Select.Option>
                  <Select.Option value="agrobank">AGROBANK</Select.Option>
                  <Select.Option value="alRajhiBank">AL-RAJHI BANKING&INVESTMENT CORP (M) BHD</Select.Option>
                  <Select.Option value="allianceBank">ALLIANCE BANK MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="ambank">AMBANK/AMFINANCE BERHAD</Select.Option>
                  <Select.Option value="bangkokBank">BANGKOK BANK BERHAD</Select.Option>
                  <Select.Option value="bankIslam">BANK ISLAM MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="bankRakyat">BANK KERJASAMA RAKYAT MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="bankMuamalat">BANK MUAMALAT MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="bankOfAmerica">BANK OF AMERICA (MALAYSIA) BHD</Select.Option>
                  <Select.Option value="bankOfChina">BANK OF CHINA (MALAYSIA) BERHAD</Select.Option>
                  <Select.Option value="bankSimpananNational">BANK SIMPANAN NASIONAL BERHAD</Select.Option>
                  <Select.Option value="bigPayEwallet">BIGPAY EWALLET</Select.Option>
                  <Select.Option value="bnpParibas">BNP PARIBAS MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="chinaConstructionBank">CHINA CONSTRUCTION BANK (MALAYSIA) BERHAD</Select.Option>
                  <Select.Option value="cimbBank">CIMB BANK BERHAD</Select.Option>
                  <Select.Option value="citibank">CITIBANK</Select.Option>
                  <Select.Option value="deutscheBank">DEUTSCHE BANK (MALAYSIA) BERHAD</Select.Option>
                  <Select.Option value="finexusCards">FINEXUS CARDS SDN BHD</Select.Option>
                  <Select.Option value="gxBank">GXBank</Select.Option>
                  <Select.Option value="hsbcBank">HSBC BANK MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="industrialAndCommercialBankOfChina">INDUSTRIAL AND COMMERCIAL BANK OF CHINA</Select.Option>
                  <Select.Option value="jpMorganChaseBank">J.P. MORGAN CHASE BANK BERHAD</Select.Option>
                  <Select.Option value="kuwaitFinanceHouse">KUWAIT FINANCE HOUSE (MALAYSIA) BERHAD</Select.Option>
                  <Select.Option value="maybank">MAYBANK BERHAD</Select.Option>
                  <Select.Option value="mbsbBank">MBSB BANK BERHAD</Select.Option>
                  <Select.Option value="mizuhoBank">MIZUHO BANK (MALAYSIA) BERHAD</Select.Option>
                  <Select.Option value="mufgBank">MUFG BANK (MALAYSIA) BERHAD</Select.Option>
                  <Select.Option value="ocbcBank">OCBC BANK (M) BHD/OCBC AL-AMIN BANK BHD</Select.Option>
                  <Select.Option value="publicBank">PUBLIC BANK/PUBLIC FINANCE BERHAD</Select.Option>
                  <Select.Option value="rhbBank">RHB BANK BERHAD</Select.Option>
                  <Select.Option value="standardCharteredBank">STANDARD CHARTERED BANK MALAYSIA BERHAD</Select.Option>
                  <Select.Option value="sumitomoMitsuiBankingCorp">SUMITOMO MITSUI BANKING CORP MSIA BHD</Select.Option>
                  <Select.Option value="touchNGo">TOUCH & GO</Select.Option>
                  <Select.Option value="unitedOverseasBank">UNITED OVERSEAS BANK (MALAYSIA) BERHAD</Select.Option>
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
  const subdomain = await fetchSubdomainFromAgentDatabase(context);


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
      subdomain,
    },
  };
};
