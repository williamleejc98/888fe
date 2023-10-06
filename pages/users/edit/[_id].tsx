import { AntdEditInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import React from "react";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export const UserEdit: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { formProps, saveButtonProps, queryResult } = useForm();

  const usersData = queryResult?.data?.data;

  const { selectProps: agentSelectProps } = useSelect({
      resource: "agents",
      defaultValue: usersData?.agent,
  });

return (
    <Edit saveButtonProps={saveButtonProps}>
    <Form {...formProps} layout="vertical">
        <Form.Item
            label={translate("Promotion Duration")}
            name={["activePromotion.promotionDuration"]}
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


export default UserEdit;