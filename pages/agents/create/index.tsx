import React, { useState } from 'react';
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useTranslate } from "@refinedev/core";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
2
export default function AgentCreate() {
    const translate = useTranslate();
    const { formProps, saveButtonProps } = useForm();
    
    const [subdomainPreview, setSubdomainPreview] = useState("");

    return (

        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                layout="vertical"
                onValuesChange={(changedValues) => {
                    if (changedValues.subdomain) {
                        setSubdomainPreview(changedValues.subdomain + ".play888king.com");
                    }
                }}
            >     
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
                    label={translate("PT% - Profit Taking")}
                    name={["positionTaking"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
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
                    label={translate("Confirm Password")}
                    name={["passwordRepeat"]}
                    dependencies={['password']}
                    rules={[
                        {
                            required: true,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue(['password']) === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(translate('The two passwords that you entered do not match!')));
                            },
                        }),
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


            </Form>
        </Create>


    )
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
