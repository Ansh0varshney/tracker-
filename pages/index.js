import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  // Optionally, redirect to /campaigns or /login
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (!user) {
      window.location.href = '/login';
    } else {
      window.location.href = '/campaigns';
    }
  }
  return null;
}