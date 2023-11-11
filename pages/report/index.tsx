import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { stringify } from "query-string";
import { DataProvider } from "@refinedev/core";
import { IResourceComponentsProps, BaseRecord, useTranslate, useMany } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Table, Space, Modal, Form, Input, Button, Card, DatePicker, Row, Col } from "antd";
import axios from "axios"; // Import axios
import nookies from 'nookies'; // Assuming you have nookies installed
import moment from 'moment';


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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 100, total: 1000000 });
  const [searchQuery, setSearchQuery] = useState("");
  const [totalGames, setTotalGames] = useState(0);
  const [totalTurnover, setTotalTurnover] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [totalWinLoss, setTotalWinLoss] = useState(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
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
  const fetchSummary = (username = "") => {
    let API_URL = `https://api.play888king.com/reports/userstats?specificUsername=${username}`;
    if (startDate) {
      API_URL += `?startDate=${startDate}`;
    }
    if (endDate) {
      API_URL += startDate ? `&endDate=${endDate}` : `?endDate=${endDate}`;
    }
    const jwtTokenObject = nookies.get(null, 'jwt');
    console.log(`JWT Object: ${jwtTokenObject}`); // Log the JWT token

    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';
    console.log(`JWT Token: ${jwtToken}`); // Log the JWT token

    const jwtTokenAsString = jwtToken ? jwtToken.toString() : '';
    console.log(`JWT Token as string: ${jwtTokenAsString}`); // Log the JWT token

    const axiosInstance = axios.create();

    axiosInstance.get(API_URL)
      .then(response => {
        const data = response.data;
        setTotalGames(data.totalGames);
        setTotalTurnover(data.totalTurnover);
        setTotalPayout(data.totalPayoutAmount);
        setTotalWinLoss(data.totalWinLoss);
      })
      .catch(err => {
        console.error("Error fetching summary:", err);
      });
  };

  const fetchData = (query = "") => {
    console.log('fetchData called'); // Log when fetchData is called

    const jwtTokenObject = nookies.get(null, 'jwt');
    console.log(`JWT Object: ${jwtTokenObject}`); // Log the JWT token

    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';
    console.log(`JWT Token: ${jwtToken}`); // Log the JWT token

    const jwtTokenAsString = jwtToken ? jwtToken.toString() : '';
    console.log(`JWT Token as string: ${jwtTokenAsString}`); // Log the JWT token

    // Create a new instance of axios
    const axiosInstance = axios.create();

    // Set up an Axios request interceptor
    axiosInstance.interceptors.request.use((config) => {
      if (jwtTokenAsString) {
        config.headers.Authorization = `Bearer ${jwtTokenAsString}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
    let API_URL = `${API_ENDPOINT}?page=${pagination.current}&pageSize=${pagination.pageSize}&specificUsername=${query}`;
    if (startDate) {
      API_URL += `&startDate=${startDate}`;
    }
    if (endDate) {
      API_URL += `&endDate=${endDate}`;
    }
    axiosInstance.get(API_URL)
      .then(response => {
        const data = response.data;
        console.log(data); // Log the data

        if (data && Array.isArray(data)) {
          setReportData(data);
          // If the data length is less than the page size, update the total count
          if (data.length < pagination.pageSize) {
            setPagination(prev => ({ ...prev, total: (pagination.current - 1) * pagination.pageSize + data.length }));
          }
        }
      })
      .catch(err => {
        console.error("Error fetching data:", err);
      });
  };
  useEffect(() => {
    fetchData(searchQuery);
    fetchSummary(searchQuery);
  }, [pagination.current, searchQuery]);


  useEffect(() => {
    fetchSummary(searchQuery);
  }, []);
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

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col span={6}>
          <DatePicker
            showTime
            onChange={(date) => setStartDate(date ? date.toISOString() : null)}
            placeholder="Start Date"
          />
        </Col>
        <Col span={6}>
          <DatePicker
            showTime
            onChange={(date) => setEndDate(date ? date.toISOString() : null)}
            placeholder="End Date"
          />
        </Col>

      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={3}>
          <Button onClick={() => { setStartDate(moment().toISOString()); setEndDate(moment().toISOString()); }}>TODAY</Button>
        </Col>
        <Col span={3}>
          <Button onClick={() => { setStartDate(moment().subtract(1, 'weeks').startOf('week').toISOString()); setEndDate(moment().toISOString()); }}>LAST WEEK</Button>
        </Col>
        <Col span={3}>
          <Button onClick={() => { setStartDate(moment().subtract(1, 'months').startOf('month').toISOString()); setEndDate(moment().toISOString()); }}>LAST MONTH</Button>
        </Col>
        <Col span={3}>
          <Button onClick={() => { setStartDate(moment().subtract(3, 'months').toISOString()); setEndDate(moment().toISOString()); }}>3 MONTHS</Button>
        </Col>
        <Col span={3}>
          <Button onClick={() => { setStartDate(null); setEndDate(null); }}>ALL TIME</Button>
        </Col>
        <Col span={4}>
          <Button onClick={handleSearch}>Search</Button>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Card title="Total Games Played" style={{ width: 300 }}>
          <p>{totalGames}</p>
        </Card>
        <Card title="Total Turnover" style={{ width: 300 }}>
          <p>{totalTurnover}</p>
        </Card>
        <Card title="Total Payout" style={{ width: 300 }}>
          <p>{totalPayout}</p>
        </Card>
        <Card title="Total Win/Loss" style={{ width: 300 }}>
          <p>{totalWinLoss}</p>
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
