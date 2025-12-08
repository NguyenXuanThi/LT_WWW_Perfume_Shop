import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface AccountSidebarProps {
    activePath: string;
    onLogout: () => Promise<void>; // Hàm xử lý logic trước khi logout
}

const menuItems = [
    // { name: 'ORDERS', path: '/account/orders' },
    // { name: 'ADDRESSES', path: '/account/addresses' },
    { name: 'ACCOUNT DETAILS', path: '/account' },
    { name: 'LOG OUT', path: '/logout' },
];

const AccountSidebar: React.FC<AccountSidebarProps> = ({ activePath, onLogout }) => {
    const navigate = useNavigate();

    // Xử lý khi nhấn nút LOG OUT
    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Ngăn chặn chuyển hướng mặc định của Link
        e.preventDefault(); 
        
        onLogout();

        // Chuyển hướng đến trang đăng nhập sau khi xử lý xong
        navigate('/'); 
    };

    return (
        <div className="w-full md:w-64 bg-black text-white p-6 md:p-0 border-2 border-black">
            <nav className="flex flex-col gap-4">
                {menuItems.map((item) => {
                    const isLogout = item.name === 'LOG OUT';

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            // Dùng onClick chỉ khi là nút LOG OUT
                            onClick={isLogout ? handleLogout : undefined}
                            className={`py-3 px-6 text-sm font-semibold tracking-wider ${
                                item.path === activePath 
                                    ? 'bg-white text-black' 
                                    : 'text-white hover:bg-slate-800'
                            } ${isLogout ? 'mt-4 border-t border-slate-700' : ''}`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default AccountSidebar;