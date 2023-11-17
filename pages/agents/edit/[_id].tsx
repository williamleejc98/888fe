import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, message, Button } from "antd";
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export const AgentEdit: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { formProps, queryResult } = useForm();
    console.log('formProps:', formProps); // Log formProps
    console.log('queryResult:', queryResult); // Log queryResult

    const agentsData = queryResult?.data?.data;
    console.log('agentsData:', agentsData); // Log agentsData

    const username = agentsData?.username;
    console.log('username:', username); // Log username
    const router = useRouter();
    const handleSubmit = async (values: { [key: string]: any }) => {
        console.log('handleSubmit called with values:', values);
        console.log('username:', username);
        try {
            const response = await axios.patch(`https://api.play888king.com/agents/${username}`, values);
            console.log('response:', response); // Log response
            message.success(translate("Successfully updated!"));
            router.push('/agents'); // Redirect to /agents
        } catch (error) {
            console.log('axios request failed with error:', error);
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

        <Form.Item>
            <Button type="primary" htmlType="submit">
                {translate("Submit")}
            </Button>
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
