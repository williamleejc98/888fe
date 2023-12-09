import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useTranslate } from "@refinedev/core";
import { Create, useForm, getValueFromEvent } from "@refinedev/antd";
import { Form, Input, Row, Col, Alert, Upload, Button } from "antd";
import LogoUpload from "./logoupload";

export default function AgentCreate() {
    const translate = useTranslate();
    const [form] = Form.useForm();

    const { formProps, saveButtonProps } = useForm();
    const [subdomainPreview, setSubdomainPreview] = useState("");
    const [filePath, setFilePath] = useState(''); // Move this line here




    return (
        <div style={{ maxWidth: "800px" }}>

            <Create saveButtonProps={saveButtonProps}>
                <Form
                    {...formProps}
                    layout="vertical"
                    initialValues={{ logoImage: filePath }}
                    onValuesChange={(changedValues) => {
                        if (changedValues.subdomain) {
                            setSubdomainPreview(changedValues.subdomain + ".play888king.com");
                        }
                    }}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Alert message="Authentication" type="info" />
                            <Form.Item
                                label={translate("Username")}
                                name={["username"]}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                               <Input addonBefore="P888" />
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
                                <Input type="password" />
                            </Form.Item>
                            <Form.Item
                                label={translate("Subdomain Prefix, xyz.play888king.com (Only choose small letter)") + (subdomainPreview ? ` - Users can visit this agent's website at ${subdomainPreview}` : '')}
                                name={["subdomain"]}
                                rules={[
                                    {
                                        required: true,
                                        pattern: /^[a-z0-9]+$/,
                                        message: translate('Subdomain should be in lowercase letters and can include numbers!'),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Alert message="Contact Information" type="info" />
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
                                label={translate("Contact Email")}
                                name={["contactEmail"]}
                                rules={[
                                    {
                                        required: true,
                                        type: 'email',
                                        message: translate('Please enter a valid email!'),
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label={translate("Contact Telegram")}
                                name={["contactTelegram"]}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input prefix="https://t.me/" />
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
                                   <Input addonBefore="+6" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                        <Col span={24}>
                         
                            <Form.Item
                                label={translate("(MYR) Starting Credit Balance - Ensure you have enough credit in your account")}
                                name={["agentCredit"]}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>

                        <Col span={24}>
                            <Alert message="Company Details" type="info" />
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
                                label={translate("Logo")}
                                name={['logoImage']}
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                                valuePropName="value"
                            >
                                <LogoUpload />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Create>
        </div>
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