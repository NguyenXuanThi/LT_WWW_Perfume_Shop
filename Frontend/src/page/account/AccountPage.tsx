import { useStore } from '@/store';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AccountDetailsForm from '@/components/account/AccountDetailsForm'; 
// ⭐️ IMPORT COMPONENT MỚI
import AccountSidebar from '@/components/layout/Sidebar'; 

// Màu sắc và font chữ được lấy từ các file Header/Footer (Tailwind default)

const AccountPage = () => {
    const { removeToken, removeUser } = useStore()

    const activePath = '/account'; // Giả sử path hiện tại

    // ⭐️ HÀM XỬ LÝ LOGIC LOGOUT ⭐️
    const handleLogoutLogic = async () => {
        if (confirm("Bạn có chắc muốn logout ra không?")) {
            removeToken(); removeUser();
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Header />

            <main className="mx-auto max-w-6xl px-4 py-8">
                {/* Tiêu đề trang */}
                <h1 className="mb-8 text-2xl font-light uppercase tracking-widest text-center md:text-3xl">
                    MY ACCOUNT
                </h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* ⭐️ CỘT TRÁI: SỬ DỤNG ACCOUNT SIDEBAR ⭐️ */}
                    <AccountSidebar 
                        activePath={activePath} 
                        onLogout={handleLogoutLogic} 
                    />

                    {/* Cột phải: Content */}
                    <div className="flex-1 min-w-0 p-4 border border-slate-200 rounded-lg shadow-sm">
                        {/* Sử dụng <Outlet /> nếu bạn muốn các Route con (ví dụ: /account/orders)
                          được render ở đây. Nếu không, chỉ cần render component chi tiết.
                          Hiện tại, chúng ta render chi tiết Account Details.
                        */}
                        {activePath === '/account' && (
                            <AccountDetailsForm />
                        )}
                        
                        {/* Nếu bạn dùng Nested Routes:
                        <Outlet /> 
                        */}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AccountPage;