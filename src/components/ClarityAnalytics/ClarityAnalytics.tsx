"use client";

import Script from "next/script";
import { useClarityConsent } from "@/hooks/useClarityConsent";
import { CLARITY_PROJECT_ID } from "@/utils/clarity";

// Loaded only after analytics consent.
const ClarityAnalytics = () => {
  const consented = useClarityConsent();

  if (!CLARITY_PROJECT_ID || !consented) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_PROJECT_ID}");`}
    </Script>
  );
};

export default ClarityAnalytics;
