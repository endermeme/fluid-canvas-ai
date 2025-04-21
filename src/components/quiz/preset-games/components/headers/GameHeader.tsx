
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Plus, Share, History, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

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
  progress,
  timeLeft,
  score,
  currentItem,
  totalItems,
  onShare
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
    // Quay lại menu setting của game
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
      <div className="flex items-center justify-between bg-white border-b border-gray-200 h-16 px-4 md:px-6">
        {/* Left side */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
            aria-label="Quay về danh sách game"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={handleHome}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
            aria-label="Trang chủ"
          >
            <Home size={20} />
          </button>
          <h1 className="text-xl font-bold ml-2 text-gray-800">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSettings}
            className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white"
            aria-label="Thiết lập game"
          >
            <Plus size={20} />
          </button>
          
          <button
            onClick={handleShare}
            className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md text-white flex items-center"
            aria-label="Chia sẻ"
            disabled={!gameId && !onShare}
          >
            <Share size={18} className="mr-1" />
            <span>Chia sẻ</span>
          </button>
          
          <button
            onClick={handleHistory}
            className="bg-purple-500 hover:bg-purple-600 p-2 rounded-full text-white"
            aria-label="Lịch sử"
          >
            <History size={20} />
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chia sẻ game</h2>
              <button 
                onClick={closeShareModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <QRCodeSVG 
                value={shareUrl} 
                size={200}
                className="mb-4"
              />
              <p className="text-sm text-gray-500">Quét mã QR để truy cập game</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Hoặc chia sẻ đường link:</p>
              <div className="flex">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-grow p-2 border rounded-l-md text-sm bg-gray-50"
                />
                <button 
                  onClick={() => copyToClipboard(shareUrl)}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r-md text-sm"
                >
                  Sao chép
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={closeShareModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
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
