import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, message } from "antd";
import React, { useState } from 'react';
import axios from 'axios';

export const AgentEdit: React.FC<IResourceComponentsProps> = () => {


    const translate = useTranslate();
    const { formProps, saveButtonProps, queryResult } = useForm();
    const agentsData = queryResult?.data?.data;
    const username = agentsData?.username;
    const handleSubmit = async (values) => {
        try {
            const response = await axios.patch(`/agents/${username}`, values);
            // handle your response
            message.success(translate("Successfully updated!"));
        } catch (error) {
            // handle your error
            message.error(translate("Update failed!"));
        }
    };
    
    return (
    <Form {...formProps} layout="vertical" onFinish={handleSubmit}>
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
                    label={translate("Contact Number")}
                    name={["contactNumber"]}
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
