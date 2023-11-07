import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, BaseRecord, useTranslate, useMany } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Table, Space, Modal, Form, Input, Button } from "antd";
import nookies from 'nookies';

const API_ENDPOINT = "https://api.play888king.com/reports/all";

export default function PromoreportTable() {
  const [reportData, setReportData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = (query = "") => {
    const API_URL = `${API_ENDPOINT}?page=${pagination.current}&pageSize=${pagination.pageSize}&username=${query}`;

    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data && data.data) {
          setReportData(data.data);
          setPagination(prev => ({ ...prev, total: data.total }));
        }
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    fetchData(searchQuery);
  }, [pagination.current, searchQuery]);

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  return (
    <>
      <Input.Search
        placeholder="Search"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />

      <Table
        dataSource={reportData}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      >
        <Table.Column title="ID" dataIndex="id" />
        <Table.Column title="Ticket ID" dataIndex="ticket_id" />
        <Table.Column title="Game Code" dataIndex="game_code" />
        <Table.Column title="Username" dataIndex="username" />
        <Table.Column title="Bet Stake" dataIndex="bet_stake" />
        <Table.Column title="Payout Amount" dataIndex="payout_amount" />
        <Table.Column title="Before Balance" dataIndex="before_balance" />
        <Table.Column title="After Balance" dataIndex="after_balance" />
        <Table.Column title="Report Date" dataIndex="report_date" />
        <Table.Column title="Detail" render={(text, record) => <a href={record.report_link} target="_blank" rel="noopener noreferrer">View Detail</a>} />
      </Table>
    </>
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
