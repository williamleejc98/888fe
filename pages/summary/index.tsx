import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState, useEffect } from "react";
import { authProvider } from "src/authProvider";
import nookies from 'nookies';

export default function Summary() {
  const iframeUrl = "https://bo.go888king.com/report/operator-performance-iframe?host_id=d2b154ee85f316a9ba2b9273eb2e3470&username=play888kingmain&event_type=0";

  return (
    <iframe 
      src={iframeUrl} 
      style={{ width: '100%', height: '80vh' }} 
      frameBorder="0"
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);
  if (!authenticated) {
    return {
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/summaries")}`,
        permanent: false,
      },
    };
  }

  return { props: {} };
};
