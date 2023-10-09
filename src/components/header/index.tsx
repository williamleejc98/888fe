import { DownOutlined } from "@ant-design/icons";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity, useGetLocale } from "@refinedev/core";
import {
  Avatar,
  Button,
  Dropdown,
  Layout as AntdLayout,
  MenuProps,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts";
import { decode as jwtDecode } from "jsonwebtoken";

import nookies from "nookies";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar?: string;
  creditBalance?: number;
};



interface MyJwtPayload {
  username: string;
  // ... any other fields you expect in the payload
}
export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const [user, setUser] = React.useState<IUser | null>(null);

  const { token } = useToken();
  const [creditBalance, setCreditBalance] = React.useState<number | null>(null);


  React.useEffect(() => {
    const fetchCreditBalance = async () => {
      const jwt = nookies.get()["jwt"];
      if (jwt) {
        const decodedToken = jwtDecode(jwt) as MyJwtPayload;
        const username = decodedToken?.username;

        if (username) {
          const response = await fetch(`https://api.play888king.com/agents/username/${username}`);
          const data = await response.json();
          setCreditBalance(data.agentCredit);
          setUser({
            id: data._id, 
            name: data.username, 
            creditBalance: data.agentCredit
          });
        }
      }
    };

    fetchCreditBalance();
  }, []);


  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
      {(user?.name) && (
          <Space style={{ marginLeft: "8px" }} size="middle">
            {user?.name && <Text strong>{user.name}</Text>}
            {creditBalance !== null && <Text strong>RM{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(creditBalance)}</Text>}
          </Space>
        )}
      </Space>
    </AntdLayout.Header>
  );
};
