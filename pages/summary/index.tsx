import { useEffect, useState } from "react";
import nookies from 'nookies';
const jwt = require('jsonwebtoken'); // Using jsonwebtoken
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";

export default function Summary() {
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    const cookies = nookies.get();
    const token = cookies.jwt; // Replace with your actual token name

    if (token) {
      try {
        // Decoding token without verifying it
        const decoded = jwt.decode(token);
        const username = decoded.username; // Assuming 'username' is the field in your token payload
        const newIframeUrl = `https://888kingplay.com/report/operator-performance-iframe?host_id=d2b154ee85f316a9ba2b9273eb2e3470&username=${username}&event_type=0`;
        setIframeUrl(newIframeUrl);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);

  return (
    <iframe 
      src={iframeUrl} 
      style={{ width: '100%', height: '80vh' }} 
      frameBorder="0"
    />
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
        destination: `${redirectTo}?to=${encodeURIComponent("/summaries")}`,
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