import React, { useState } from 'react';
import { Colors, PRODUCTS } from './utils/constants';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { NavBtn, Toast } from './components/UI';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import ScanPage from './pages/ScanPage';
import DetailPage from './pages/DetailPage';
import IssuePage from './pages/IssuePage';
import ReturnPage from './pages/ReturnPage';
import StockPage from './pages/StockPage';

const PhoneFrame = ({ children, showNav, screen }) => {
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const isLight = ['detail', 'issue', 'return', 'stock'].includes(screen);
  const bg = isLight ? '#F4F4F4' : Colors.DB;

  const handlePhoneNavClick = (nav) => {
    if (nav === 'home') {
      children.props.onNavigate('dashboard');
    } else if (nav === 'scan') {
      children.props.onNavigate('products');
    } else if (nav === 'products') {
      children.props.onNavigate('products');
    }
  };

  return (
    <div
      style={{
        background: '#C8DEEA',
        padding: '28px 16px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: screen !== 'login' ? 'flex-start' : 'center',
        minHeight: '100vh',
      }}
    >
      {screen === 'login' ? (
        <LoginPage />
      ) : (
        <div
          style={{
            width: 375,
            borderRadius: 46,
            overflow: 'hidden',
            background: bg,
            boxShadow: '0 0 0 8px #111, 0 0 0 10px #3A3A3A, 0 28px 70px rgba(0,0,0,0.45)',
            display: 'flex',
            flexDirection: 'column',
            height: 760,
            position: 'relative',
          }}
        >


          {/* Content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {children}
          </div>

          {/* Toast */}
          <Toast message={toast} show={!!toast} />

          {/* Bottom nav */}
          {showNav && screen !== 'login' && (
            <div
              style={{
                height: 68,
                display: 'flex',
                alignItems: 'center',
                background: isLight ? '#fff' : Colors.DC,
                borderTop: `1px solid ${isLight ? '#EBEBEB' : Colors.BR}`,
                flexShrink: 0,
                paddingBottom: 4,
              }}
            >
              <NavBtn
                icon="⌂"
                label="Home"
                active={screen === 'dashboard'}
                light={isLight}
                onClick={() => children.props.onNavigate('dashboard')}
              />
              <NavBtn
                icon="⬡"
                label="Scan"
                active={screen === 'scan'}
                light={isLight}
                onClick={() => children.props.onNavigate('scan')}
              />
              <NavBtn
                icon="☰"
                label="Products"
                active={screen === 'products'}
                light={isLight}
                onClick={() => children.props.onNavigate('products')}
              />
              <NavBtn
                icon="○"
                label="Profile"
                active={false}
                light={isLight}
                onClick={() => children.props.onLogout()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AppContent = () => {
  const { user, logout } = useAuth();
  const [screen, setScreen] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [action, setAction] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const handleNavigate = (page) => {
    setScreen(page);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleAction = (act) => {
    setAction(act);
  };

  const handleSubmit = async (type, data) => {
    // In production, this would call the API
    console.log(`${type} submission:`, data);
    return Promise.resolve();
  };

  const handleLogout = () => {
    logout();
    setScreen('login');
  };

  const showNav = !['issue', 'return', 'stock', 'scan', 'detail', 'login'].includes(screen);

  if (!user) {
    return <LoginPage />;
  }

  const getScreenContent = () => {
    switch (screen) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
          />
        );
      case 'products':
        return (
          <ProductsPage
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        );
      case 'detail':
        return (
          <DetailPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onAction={handleAction}
          />
        );
      case 'issue':
        return (
          <IssuePage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onSubmit={handleSubmit}
            onToast={showToast}
          />
        );
      case 'return':
        return (
          <ReturnPage
            product={selectedProduct}
            onNavigate={handleNavigate}
            onSubmit={handleSubmit}
            onToast={showToast}
          />
        );
      case 'stock':
        return (
          <StockPage
            onNavigate={handleNavigate}
            onSubmit={handleSubmit}
            onToast={showToast}
          />
        );
      case 'scan':
        return (
          <ScanPage
            onNavigate={handleNavigate}
            onToast={showToast}
          />
        );
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  const screenComponent = getScreenContent();

  return (
    <div
      style={{
        background: '#C8DEEA',
        padding: '28px 16px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700;9..40,800&display=swap');
        *{font-family:'DM Sans',-apple-system,sans-serif;box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        input,select,button{font-family:inherit;}
        input::placeholder{color:#9A9A9A;}
        select{-webkit-appearance:none;}
      `}</style>
      <div
        style={{
          width: 375,
          borderRadius: 46,
          overflow: 'hidden',
          background: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#F4F4F4' : Colors.DB,
          boxShadow: '0 0 0 8px #111, 0 0 0 10px #3A3A3A, 0 28px 70px rgba(0,0,0,0.45)',
          display: 'flex',
          flexDirection: 'column',
          height: 760,
          position: 'relative',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 26px',
            flexShrink: 0,
            background: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#F4F4F4' : '#0A0A0A',
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#111' : '#fff',
            }}
          >
            9:41
          </span>
          <div
            style={{
              width: 110,
              height: 22,
              borderRadius: 12,
              background: '#0A0A0A',
              border: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '1px solid #DDD' : 'none',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#555' : '#888',
              letterSpacing: 2,
            }}
          >
            ●▲▌
          </span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {screenComponent}
        </div>

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: 'absolute',
              bottom: showNav ? 80 : 20,
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#111',
              color: '#fff',
              padding: '11px 22px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              zIndex: 99,
              whiteSpace: 'nowrap',
              border: `1px solid ${Colors.BR}`,
            }}
          >
            {toast}
          </div>
        )}

        {/* Bottom nav */}
        {showNav && (
          <div
            style={{
              height: 68,
              display: 'flex',
              alignItems: 'center',
              background: ['detail', 'issue', 'return', 'stock'].includes(screen) ? '#fff' : Colors.DC,
              borderTop: `1px solid ${['detail', 'issue', 'return', 'stock'].includes(screen) ? '#EBEBEB' : Colors.BR}`,
              flexShrink: 0,
              paddingBottom: 4,
            }}
          >
            <NavBtn
              icon="⌂"
              label="Home"
              active={screen === 'dashboard'}
              light={['detail', 'issue', 'return', 'stock'].includes(screen)}
              onClick={() => handleNavigate('dashboard')}
            />
            <NavBtn
              icon="⬡"
              label="Scan"
              active={screen === 'products'}
              light={['detail', 'issue', 'return', 'stock'].includes(screen)}
              onClick={() => handleNavigate('products')}
            />
            <NavBtn
              icon="☰"
              label="Products"
              active={screen === 'products'}
              light={['detail', 'issue', 'return', 'stock'].includes(screen)}
              onClick={() => handleNavigate('products')}
            />
            <NavBtn
              icon="○"
              label="Profile"
              active={false}
              light={['detail', 'issue', 'return', 'stock'].includes(screen)}
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
