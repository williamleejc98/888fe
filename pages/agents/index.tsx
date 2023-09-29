import React from "react";
import {
    IResourceComponentsProps,
    BaseRecord,
    useTranslate,
} from "@refinedev/core";
import { useTable, List, EditButton, ShowButton } from "@refinedev/antd";
import { Table, Space } from "antd";

export const AgentList: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { tableProps } = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="contactPerson"
                    title={translate("Contact Person")}
                />
                <Table.Column
                    dataIndex="username"
                    title={translate("Username")}
                />
                <Table.Column
                    dataIndex="positionTaking"
                    title={translate("PT")}
                />
                <Table.Column
                    dataIndex="agentCredit"
                    title={translate("Balance")}
                />
                <Table.Column
                    dataIndex="subdomain"
                    title={translate("Subdomain")}
                />
                <Table.Column
                    dataIndex="logoImage"
                    title={translate("Logo")}
                />
                <Table.Column
                    dataIndex="companyName"
                    title={translate("Company")}
                />
                <Table.Column
                    dataIndex="contactEmail"
                    title={translate("Email")}
                />
                <Table.Column
                    dataIndex="contactTelegram"
                    title={translate("Telegram")}
                />
                <Table.Column
                    title={translate("table.actions")}
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};
