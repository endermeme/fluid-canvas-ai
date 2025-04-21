
// Responsive GameHeader - tối ưu mobile, chỉnh UI gọn, không vỡ layout trên màn hình nhỏ
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Share, X } from 'lucide-react';

interface GameHeaderProps {
  title: string;
  gameId?: string;
  onBack?: () => void;
  progress?: number;
  timeLeft?: number;
  score?: number;
  currentItem?: number;
  totalItems?: number;
  onShare?: () => Promise<void>;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  gameId,
  onBack,
  onShare,
}) => {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

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

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (gameId) {
      setShowShareModal(true);
    }
  };

  const closeShareModal = () => {
    setShowShareModal(false);
  };

  // Link chia sẻ
  const shareUrl = gameId ? `${window.location.origin}/game/${gameId}` : '';

  // Mobile layout: header nhỏ gọn
  return (
    <>
      <div
        className={`
          flex items-center justify-between
          h-14 sm:h-16 px-2 sm:px-4
          bg-white border-b border-gray-200
          w-full
          z-30
        `}
      >
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Quay về"
          >
            <ArrowLeft size={isMobile ? 18 : 20} />
          </button>
          <button
            onClick={handleHome}
            className="text-gray-600 hover:text-gray-900 p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Trang chủ"
          >
            <Home size={isMobile ? 18 : 20} />
          </button>
          <span
            className="
              text-base sm:text-xl font-bold ml-2 truncate
              max-w-[110px] sm:max-w-none
              text-gray-800
            "
          >
            {title.length > 16 && isMobile ? title.slice(0, 14) + "…" : title}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleShare}
            className={`
              bg-green-500 hover:bg-green-600 px-2 sm:px-3 py-1.5 sm:py-2
              rounded-md text-white flex items-center text-xs sm:text-sm
              disabled:opacity-40
            `}
            aria-label="Chia sẻ"
            disabled={!gameId && !onShare}
          >
            <Share size={isMobile ? 16 : 18} className="mr-1" />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>
        </div>
      </div>
      {/* Share modal giữ nguyên UI */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-xs w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base sm:text-xl font-bold">Chia sẻ game</h2>
              <button 
                onClick={closeShareModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={22} />
              </button>
            </div>
            <div className="flex flex-col items-center mb-4">
              {/* QRCodeSVG có thể thêm sau nếu cần - giữ placeholder cho UI */}
              <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded mb-2">
                QR
              </div>
              <p className="text-xs text-gray-500">Quét mã QR để truy cập nhanh</p>
            </div>
            <div className="mb-3">
              <p className="text-xs font-medium mb-1">Hoặc chia sẻ link:</p>
              <div className="flex">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-grow p-1.5 border rounded-l-md text-xs bg-gray-50"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="bg-blue-500 text-white px-2 sm:px-3 py-1.5 rounded-r-md text-xs sm:text-sm"
                >
                  Sao chép
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={closeShareModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-md text-xs"
              >Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameHeader;
