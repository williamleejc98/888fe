import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { stringify } from "query-string";
import { DataProvider } from "@refinedev/core";
import { IResourceComponentsProps, BaseRecord, useTranslate, useMany } from "@refinedev/core";
import { useTable, List, EditButton, ShowButton, DeleteButton, MarkdownField, DateField } from "@refinedev/antd";
import { useState, useEffect } from "react";
import { Table, Space, Modal, Form, Input, Button, Card, DatePicker, Row, Col, notification } from "antd";
import axios from "axios"; // Import axios
import nookies from 'nookies'; // Assuming you have nookies installed
import moment from 'moment';
import styles from './report.module.css';
import gameCodes from '../../public/game-codes.json';

type GameCodesType = {
  [key: string]: string;
}

const gameCodesTyped: GameCodesType = gameCodes as GameCodesType;
const API_ENDPOINT = "https://api.play888king.com/promoreports/all";
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
  const [refreshKey, setRefreshKey] = useState(0); // Add this line

  const [totalWinLoss, setTotalWinLoss] = useState(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sortedData = [...reportData].sort((a, b) => new Date(b.report_date) - new Date(a.report_date));

  const [iframeUrl, setIframeUrl] = useState("");

  const handleViewDetail = (url: string) => {
    setIframeUrl(url);
    setIsModalVisible(true);
  };
  const handleButtonClick = async () => {
    try {
      const response = await axios.post('https://api.play888king.com/promoreports/crawl', {
        host_id: 'd2b154ee85f316a9ba2b9273eb2e3470',
        key: '1',
        page_size: '1'
      });

      console.log(response.data);
      // Update last fetched time
      setLastFetched(new Date());

      // Show notification
      notification.success({
        message: 'Crawl Reports',
        description: 'Reports have been successfully crawled.',
      });

      // Refetch the data
      fetchData(searchQuery);
      fetchSummary(searchQuery);

    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };
  const fetchSummary = (username = "") => {
    let API_URL = `https://api.play888king.com/promoreports/userstats`;
    const params = new URLSearchParams();
    if (username) {
      params.append('specificUsername', username);
    }
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    API_URL += `?${params.toString()}`;

    const jwtTokenObject = nookies.get(null, 'jwt');
    console.log(`JWT Object: ${jwtTokenObject}`); // Log the JWT token

    const jwtToken = jwtTokenObject ? jwtTokenObject.jwt : '';
    console.log(`JWT Token: ${jwtToken}`); // Log the JWT token

    const jwtTokenAsString = jwtToken ? jwtToken.toString() : '';
    console.log(`JWT Token as string: ${jwtTokenAsString}`); // Log the JWT token

    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use((config) => {
      if (jwtTokenAsString) {
        config.headers.Authorization = `Bearer ${jwtTokenAsString}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

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
          data.sort((a, b) => a.ticket_id.localeCompare(b.ticket_id));
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
  }, [pagination.current, searchQuery, startDate, endDate]);

  const handleTableChange = (pagination: { current?: number, pageSize?: number }) => {
    setPagination(prev => ({
      current: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 10,
      total: prev.total
    }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchData(searchQuery);
    fetchSummary(searchQuery);
  };

  return (
    <>
      <Modal
        title="Detail View"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="80%"
      >
        <iframe
          src={iframeUrl}
          style={{ width: '100%', height: '80vh' }}
          frameBorder="0"
        />
      </Modal>

      <Button onClick={handleButtonClick} style={{ width: '100%', marginBottom: 16 }}>Crawl Promotion Reports</Button>
      {lastFetched && <p>Last fetched time: {lastFetched.toLocaleString()}</p>}
      <Row gutter={0} style={{ marginBottom: 16 }}>

        <Col span={10}>
          <Input
            placeholder="Search Specific Player"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col span={14}>
          <DatePicker
            showTime
            onChange={(date) => setStartDate(date ? date.toISOString() : null)}
            placeholder="Start Date"
          />
          <DatePicker
            showTime
            onChange={(date) => setEndDate(date ? date.toISOString() : null)}
            placeholder="End Date"
          />
          <Button onClick={() => { setStartDate(moment().toISOString()); setEndDate(moment().toISOString()); }}>TODAY</Button>
          <Button onClick={() => { setStartDate(moment().subtract(1, 'weeks').startOf('week').toISOString()); setEndDate(moment().toISOString()); }}>LAST WEEK</Button>
          <Button onClick={() => { setStartDate(moment().subtract(1, 'months').startOf('month').toISOString()); setEndDate(moment().toISOString()); }}>LAST MONTH</Button>
          <Button onClick={() => { setStartDate(null); setEndDate(null); }}>ALL TIME</Button>
        </Col>


      </Row>


      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Col span={6}>
          <Card className={styles.card1}>
            <h2 className={styles['card-title']}>Total Promo Games Played</h2>
            <p className={styles['card-content']}>{totalGames} Rounds</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.card2}>
            <h2 className={styles['card-title']}>Total Promo Turnover</h2>
            <p className={styles['card-content']}>RM {totalTurnover}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.card3}>
            <h2 className={styles['card-title']}>Total Promo Payout</h2>
            <p className={styles['card-content']}>RM {totalPayout}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.card4}>
            <h2 className={styles['card-title']}>Total Win/Loss</h2>
            <p className={styles['card-content']}>
  {totalWinLoss < 0 ? '+' : '-'} RM {Math.abs(totalWinLoss)}
</p>
          </Card>
        </Col>
      </div>
      <Table
        dataSource={sortedData}
        rowKey="_id"
        pagination={pagination}
        onChange={handleTableChange}
        key={refreshKey} // Add this line
      >
        <Table.Column title="Ticket ID" dataIndex="ticket_id" />
        <Table.Column 
        title="Game Name" 
        render={(text, record: RecordType) => {
          const gameName = gameCodesTyped[record.game_code];
          return gameName ? gameName : record.game_code;
        }}
      />   <Table.Column title="Username" dataIndex="username" />
        <Table.Column title="Bet Stake" dataIndex="bet_stake" />
        <Table.Column title="Payout Amount" dataIndex="payout_amount" />
      
        <Table.Column title="Before Balance" dataIndex="before_balance" />
        <Table.Column title="After Balance" dataIndex="after_balance" />
        <Table.Column title="Report Date" dataIndex="report_date" />
        <Table.Column
          title="Detail"
          render={(text, record: RecordType) => (
            <a
              onClick={(e) => {
                e.preventDefault();
                handleViewDetail(record.report_link);
              }}
              href={record.report_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Detail
            </a>
          )}
        />     </Table>

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
        destination: `${redirectTo}?to=${encodeURIComponent("/promoreports")}`,
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
