'use client';
import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Header = () => {
    const { logout, profile } = useContext(AuthContext);
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        console.log('Header rendered');
    }, [router]);
    return (
        <header className='flex space-x-4 pr-4 pt-4 mb-4 justify-end'>
            {profile?.role === 'admin' && pathname !== '/admin' && <Link href="/admin">Admin</Link>}
            {pathname !== '/' && <Link href="/">Accueil</Link>}
            <a onClick={logout} style={{ cursor: 'pointer' }}>Se déconnecter</a>
        </header>
    );
};

export default Header;