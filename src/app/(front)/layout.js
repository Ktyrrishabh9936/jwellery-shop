import CartSidebar from '@/components/cartSidebar';
import Header from '@/components/HomePage/Header';
import CartProvider from './cartProvider';


export default function UserLayout({ children }) {
  
  return (
    <CartProvider>
    <div className="dashboard-container">
      {/* Sidebar */}
      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Header */}
        <Header/>
        {/* Dynamic Content */}
        <main className="dashboard-main">{children}</main>
        <CartSidebar/>
      </div>
    </div>
    </CartProvider>
  );
}
