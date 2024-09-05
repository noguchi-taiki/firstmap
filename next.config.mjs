/** @type {import('next').NextConfig} */
// const dns = import("dns");これはネットのやつでcommonjs?の書き方
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");
//laraevlとの連携にてデフォルトでipv6を使っているらしいのでそこを変更する

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['maps.googleapis.com'],
  },
};

export default nextConfig;
