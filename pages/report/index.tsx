import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { IResourceComponentsProps, BaseRecord, useTranslate, useMany } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Table, Space, Modal, Form, Input, Button, Card } from "antd";
import { axiosInstance } from "../../src/utils/axios"; // Import axiosInstance
import nookies from 'nookies'; // Assuming you have nookies installed


const API_ENDPOINT = "https://api.play888king.com/reports/all";
type RecordType = {
  id: string;
  ticket_id: string;
  game_code: string;
  username: string;
  bet_stake: number;
  payout_amount: number;
  before_balance: number;
  after_balance: number;
  report_date: string;
  report_link: string;
};
export default function ReportTable() {
  const [reportData, setReportData] = useState<RecordType[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 1000 });
  const [searchQuery, setSearchQuery] = useState("");
  const [totalBetStake, setTotalBetStake] = useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  // Add new state variables for total win and total loss
  const [totalWin, setTotalWin] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);

  const handleButtonClick = async () => {
    try {
      const response = await axios.post('https://api.play888king.com/reports/crawl', {
        host_id: 'd2b154ee85f316a9ba2b9273eb2e3470',
        key: '1',
        page_size: '1'
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };


  const fetchData = (query = "") => {
   
    const API_URL = `${API_ENDPOINT}?page=${pagination.current}&pageSize=${pagination.pageSize}&specificUsername=${query}`;
  
    axiosInstance.get(API_URL)
    .then(response => {
      const data = response.data;
      console.log(data); // Log the data
  
      if (data && Array.isArray(data)) {
        setReportData(data);
        // Assuming each page has a fixed number of items
        setPagination(prev => ({ ...prev, total: data.length * pagination.pageSize }));
      }
      // Calculate total bet stake, total games played, and total win/loss
      let totalStake = 0;
      let totalWin = 0;
      let totalLoss = 0;
      data.forEach((record: RecordType) => {
        totalStake += record.bet_stake;
        const potentialBalance = record.before_balance + record.bet_stake;
        if (record.payout_amount > 0) {
          totalWin += (record.payout_amount - potentialBalance);
        } else {
          totalLoss += record.bet_stake;
        }
      });
      setTotalBetStake(totalStake);
      setTotalGamesPlayed(data.length);
      setTotalWin(totalWin);
      setTotalLoss(totalLoss);
    })
    .catch(err => {
      console.error("Error fetching data:", err);
    });
  };
  useEffect(() => {
    fetchData(searchQuery);
  }, [pagination.current, searchQuery]);

  const handleTableChange = (pagination: { current?: number, pageSize?: number }) => {
    setPagination({
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 10
    });
  };
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };
  return (
    <>
      <Button onClick={handleButtonClick}>Crawl Reports</Button>

      <Input.Search
        placeholder="Search"
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Card title="Total Turnover" style={{ width: 300 }}>
          <p>{totalBetStake}</p>
        </Card>
        <Card title="Total Games Played" style={{ width: 300 }}>
          <p>{totalGamesPlayed}</p>
        </Card>
        <Card title="Total Win" style={{ width: 300 }}>
          <p>{totalWin}</p>
        </Card>
        <Card title="Total Loss" style={{ width: 300 }}>
          <p>{totalLoss}</p>
        </Card>
      </div>
      <Table
        dataSource={reportData}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
      >
        <Table.Column title="Ticket ID" dataIndex="ticket_id" />
        <Table.Column title="Game Code" dataIndex="game_code" />
        <Table.Column title="Username" dataIndex="username" />
        <Table.Column title="Bet Stake" dataIndex="bet_stake" />
        <Table.Column title="Payout Amount" dataIndex="payout_amount" />
        <Table.Column title="Before Balance" dataIndex="before_balance" />
        <Table.Column title="After Balance" dataIndex="after_balance" />
        <Table.Column title="Report Date" dataIndex="report_date" />
        <Table.Column title="Detail" render={(text, record: RecordType) => <a href={record.report_link} target="_blank" rel="noopener noreferrer">View Detail</a>} />      </Table>

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
        destination: `${redirectTo}?to=${encodeURIComponent("/reports")}`,
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
