'use client';

import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/Navbar/Navbar'), { ssr: false });

export default function ClientNavbar() {
  return <Navbar />;
}
