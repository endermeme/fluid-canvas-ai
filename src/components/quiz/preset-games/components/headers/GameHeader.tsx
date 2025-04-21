
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Settings, Share, X, History } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface GameHeaderProps {
  gameId?: string;
  onBack?: () => void;
  onShare?: () => Promise<void>;
  title?: string;
  progress?: number;
  timeLeft?: number;
  score?: number;
  currentItem?: number;
  totalItems?: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  gameId,
  onBack,
  onShare,
  title,
}) => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/preset-games');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleSettings = () => {
    navigate(`/preset-games/settings/${gameId}`);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (gameId) {
      setShowShareModal(true);
    }
  };

  const handleHistory = () => {
    navigate('/history');
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Đã sao chép link chia sẻ vào clipboard!');
      })
      .catch((err) => {
        console.error('Không thể sao chép: ', err);
      });
  };

  const shareUrl = gameId ? `${window.location.origin}/game/${gameId}` : '';

  return (
    <>
      <header
        className="flex items-center justify-between h-14 px-3 md:px-5 border-b border-gray-200 bg-white/90 backdrop-blur-md rounded-b-lg shadow-sm"
        style={{ minHeight: 48 }}
      >
        {/* Left buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
            aria-label="Quay về danh sách game"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={handleHome}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
            aria-label="Trang chủ"
            type="button"
          >
            <Home size={20} />
          </button>
        </div>
        {/* Right action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleSettings}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
            aria-label="Thiết lập game"
            type="button"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
            aria-label="Chia sẻ"
            type="button"
            disabled={!gameId && !onShare}
          >
            <Share size={18} />
          </button>
          <button
            onClick={handleHistory}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition"
            aria-label="Lịch sử"
            type="button"
          >
            <History size={20} />
          </button>
        </div>
      </header>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold">Chia sẻ game</h2>
              <button 
                onClick={closeShareModal}
                className="text-gray-500 hover:text-gray-800"
                type="button"
              >
                <X size={22} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-5">
              <QRCodeSVG 
                value={shareUrl} 
                size={180}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">Quét mã QR để truy cập game</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Hoặc chia sẻ đường link:</p>
              <div className="flex">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-grow p-2 border rounded-l-md text-[13px] bg-gray-50"
                  aria-label="Link chia sẻ"
                />
                <button 
                  onClick={() => copyToClipboard(shareUrl)}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md text-sm hover:bg-gray-300 transition"
                  type="button"
                >
                  Sao chép
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={closeShareModal}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm transition"
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameHeader;
