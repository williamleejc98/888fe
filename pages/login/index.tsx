import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { AppIcon } from "src/components/app-icon";
const authWrapperProps = {
  style: {
      background:
          "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('https://i.ibb.co/2PWmbS9/BG.png')",
      backgroundSize: "cover",
  },
};

export default function Login() {
  return (
    <div style={authWrapperProps.style}>

    <AuthPage
      type="login"
      formProps={{
        initialValues: { email: "yourusername@play888king.com", password: "123123123" },
      }}
      title={
        <ThemedTitleV2
          collapsed={false}
          text="888"
          icon={<AppIcon />}
        />
      }
    />
        </div>

  );
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: redirectTo ?? "/",
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
