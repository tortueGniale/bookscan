'use client';
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { logout } = useContext(AuthContext);
    return (
        <header>
            <a onClick={logout} style={{ cursor: 'pointer' }}>Se déconnecter</a>
        </header>
    );
};

export default Header;