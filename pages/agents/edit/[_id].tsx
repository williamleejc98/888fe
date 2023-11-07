import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, message } from "antd";
import React, { useState } from 'react';
import fileType from 'file-type';

import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export const AgentEdit: React.FC<IResourceComponentsProps> = () => {
    const [crop, setCrop] = useState({ aspect: 1/1 });
    const [src, setSrc] = useState<string | null>(null);

    const translate = useTranslate();
    const { formProps, saveButtonProps, queryResult } = useForm();
    const agentsData = queryResult?.data?.data;
    const username = agentsData?.username;

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        if (e && e.fileList) {
            return [e.fileList.slice(-1)];
        }
        return null; // Or handle the case when fileList is missing or not an array
    };
    
    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
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
                    label={translate("Logo")}
                    name={["logoImage"]}
                    getValueFromEvent={normFile}
                    rules={[
                        {
                            required: false,
                            message: 'Please upload a logo!',
                        },
                    ]}
                >
              
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
