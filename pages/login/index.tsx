import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { AppIcon } from "src/components/app-icon";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Button, message } from "antd"; // Import message from antd for displaying notifications
import styles from "./Login.module.css"; // Import your custom CSS module
interface LoginFormValues {
  username: string;
  password: string;
}

const authWrapperProps = {
  style: {
      background:
          "padding:24px;radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('https://i.ibb.co/2PWmbS9/BG.png')",
      backgroundSize: "cover",
  },
};

export default function Login() {
  const router = useRouter();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const { success, error, redirectTo } = await authProvider.login(values);
  
      if (success) {
        // Redirect the user to the specified destination (default: '/')
        router.push(redirectTo || "/");
      } else {
        // Handle authentication errors
        message.error(error?.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div style={authWrapperProps.style} className={styles.loginContainer}>
      <div className={styles.logo}>
       <img src="/888logo.png"></img>
      </div>
      <Form
        name="login"
        initialValues={{ username: "", password: "" }}
        onFinish={onFinish}
        className={styles.loginForm}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
  <Input 
    placeholder="Username" 
    onChange={e => e.target.value = e.target.value.toLowerCase()} 
  />        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
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
