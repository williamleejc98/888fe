import { useLogin } from "@refinedev/core";

import { Button, Layout, Space, Typography } from "antd";

import { useTranslate } from "@refinedev/core";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { AppIcon } from "src/components/app-icon";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Login() {
  const { mutate: login } = useLogin();

  const t = useTranslate();

  return (
    <Layout
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: 'url("https://i.ibb.co/2PWmbS9/BG.png")',
        backgroundSize: 'cover', // or 'contain'
        backgroundRepeat: 'no-repeat'

      }}
    >
      <Space direction="vertical" align="center">
      <AppIcon />
        <Button
          style={{ width: "240px", marginBottom: "32px" }}
          type="primary"
          size="middle"
          onClick={() => login({})}
        >
          {t("pages.login.signin", "Sign in")}
        </Button>
        <Typography.Text type="secondary">
      
        </Typography.Text>
      </Space>
    </Layout>
  );
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (session) {
    return {
      props: {},
      redirect: {
        destination: "/",
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
