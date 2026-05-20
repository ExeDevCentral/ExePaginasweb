
import { Helmet } from 'react-helmet-async';

export const AdSense = () => {
  return (
    <Helmet>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9450015187260945"
        crossOrigin="anonymous"
      ></script>
    </Helmet>
  );
};

