"use client"
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Server, Zap } from 'lucide-react';

export default function KeepAlive() {
  const [mlStatus, setMlStatus] = useState('Pinging...');
  const [socketStatus, setSocketStatus] = useState('Pinging...');
  const [lastPing, setLastPing] = useState(null);

  useEffect(() => {
    const pingServers = async () => {
      const now = new Date().toLocaleTimeString();
      setLastPing(now);

      // Ping Flask ML Server
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_FLASK_URL}/ping`);
        setMlStatus(res.ok ? '✅ ML Server Alive' : '❌ ML Server Error');
      } catch {
        setMlStatus('❌ ML Server Unreachable');
      }

      // Ping Socket.IO Server
      // it is deployed on render
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/ping`);
        setSocketStatus(res.ok ? '✅ Socket Server Alive' : '❌ Socket Server Error');
      } catch {
        setSocketStatus('❌ Socket Server Unreachable');
      }
    };

    pingServers(); // Initial ping
    const interval = setInterval(pingServers, 180000); // Every 3 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Server Pinger</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-white flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-purple-300 relative overflow-hidden">

          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-purple-400 opacity-30 animate-ping-slow"></div>
              <div className="absolute inset-0 rounded-full bg-purple-500 opacity-20 animate-ping-slower"></div>
              <div className="flex items-center justify-center w-full h-full">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl shadow-md">
                  <Zap size={28} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h1 className="text-2xl font-bold text-purple-800 mb-4">Server Pinger</h1>
            <div className="text-sm text-gray-600 bg-purple-50 rounded-lg p-4 mb-2">
              <p><strong>Flask ML:</strong> {mlStatus}</p>
              <p><strong>Socket.IO:</strong> {socketStatus}</p>
              {lastPing && <p><strong>Last Ping:</strong> {lastPing}</p>}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-ping-slow {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-ping-slower {
          animation: ping 6s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
}
