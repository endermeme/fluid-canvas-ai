
# Tính Năng Lịch Sử và Xuất Link QR

## Tổng Quan

Dự án AI Game Creator cung cấp tính năng lưu trữ lịch sử game và chia sẻ game thông qua URL và mã QR, giúp người dùng dễ dàng quản lý và chia sẻ các trò chơi đã tạo.

## 1. Tính Năng Lịch Sử Game

### Chức năng
- Lưu trữ danh sách tất cả các game đã tạo
- Hiển thị thông tin chi tiết về mỗi game (tên, ngày tạo, loại game)
- Cho phép người dùng quản lý, chỉnh sửa hoặc xóa game đã tạo
- Hỗ trợ tìm kiếm và lọc game theo các tiêu chí khác nhau

### Lưu Trữ
- Game được lưu trữ trong vps của máy chủ host cái react js này lên
- Thông tin game bao gồm:
  - ID game (tạo bằng UUID)
  - Tiêu đề game
  - Mô tả
  - Nội dung HTML
  - Thời gian tạo
  - Thời gian hết hạn (48 giờ sau khi tạo)
  - Danh sách người tham gia (nếu có)

### Cài Đặt Hiện Tại
- File `gameExport.ts` xử lý logic lưu trữ game
- File `GameHistory.tsx` hiển thị UI cho lịch sử game
- Game được lưu vào localStorage với key `shared_games`
- Hệ thống tự động dọn dẹp các game hết hạn

## 2. Tính Năng Xuất Link và QR Code

### Chức năng
- Tạo liên kết chia sẻ duy nhất cho mỗi game
- Tạo mã QR chứa liên kết chia sẻ
- Cho phép người chơi truy cập game thông qua liên kết hoặc quét mã QR
- Hỗ trợ theo dõi số lượng người tham gia qua mỗi liên kết

### Lưu Trữ
- Liên kết có dạng: `https://domain.com/game/{gameId}`
- Mã QR được tạo động dựa trên liên kết
- Dữ liệu người tham gia được lưu cùng với thông tin game

### Cài Đặt Cần Thực Hiện
- Cần thêm thư viện tạo QR code (ví dụ: qrcode.react)
- Cần triển khai thêm chức năng theo dõi số lượng người tham gia
- Cần xây dựng UI cho trang chia sẻ game

## Mã Nguồn Hiện Tại

### 1. Lưu trữ game (`gameExport.ts`)
```typescript
// Cấu trúc dữ liệu game được lưu trữ
export interface StoredGame {
  id: string;
  title: string;
  description: string;
  htmlContent: string;
  createdAt: number;
  expiresAt: number;
}

// Lưu game vào localStorage
export const saveGameForSharing = (title: string, description: string, htmlContent: string): string => {
  const id = uuidv4();
  const now = Date.now();
  const expiresAt = now + (48 * 60 * 60 * 1000); // 48 giờ
  
  const game: StoredGame = {
    id,
    title: title || "Minigame Tương tác",
    description: description || "",
    htmlContent,
    createdAt: now,
    expiresAt
  };
  
  // Lưu vào localStorage
  const gamesJson = localStorage.getItem('shared_games');
  let games: StoredGame[] = gamesJson ? JSON.parse(gamesJson) : [];
  games.push(game);
  localStorage.setItem('shared_games', JSON.stringify(games));
  
  // Trả về URL chia sẻ
  return `${window.location.origin}/game/${id}`;
};
```

### 2. Logic người tham gia (`gameParticipation.ts`)
```typescript
// Cấu trúc dữ liệu người tham gia
export interface Participant {
  id: string;
  name: string;
  joinedAt: number;
  score?: number;
}

export interface GameSession {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  participants: Participant[];
}

// Tạo phiên game mới
export const createGameSession = (title: string, content: string): GameSession => {
  const id = uuidv4();
  const gameSession: GameSession = {
    id,
    title,
    content,
    createdAt: Date.now(),
    participants: []
  };
  
  // Lưu phiên game vào localStorage
  const sessions = getAllGameSessions();
  sessions.push(gameSession);
  localStorage.setItem('game_sessions', JSON.stringify(sessions));
  
  return gameSession;
};
```

## Hướng Dẫn Triển Khai Tính Năng QR Code

### 1. Cài Đặt Thư Viện QR Code
```bash
npm install qrcode.react
```

### 2. Tạo Component QR Code
```tsx
import QRCode from 'qrcode.react';

interface GameQRProps {
  gameId: string;
  size?: number;
}

const GameQR: React.FC<GameQRProps> = ({ gameId, size = 128 }) => {
  const shareUrl = `${window.location.origin}/game/${gameId}`;
  
  return (
    <div className="flex flex-col items-center">
      <QRCode value={shareUrl} size={size} renderAs="svg" />
      <p className="text-sm text-center mt-2">Quét để chơi game</p>
    </div>
  );
};
```

### 3. Tích Hợp Vào Trang Chia Sẻ Game
```tsx
import GameQR from './GameQR';

const ShareGamePage: React.FC = () => {
  const { gameId } = useParams();
  const gameSession = getGameSessionById(gameId);
  
  return (
    <div className="container mx-auto p-4">
      <h1>Chia Sẻ Game: {gameSession.title}</h1>
      
      <div className="flex justify-center my-6">
        <GameQR gameId={gameId} size={200} />
      </div>
      
      <div className="text-center">
        <p>Chia sẻ link:</p>
        <div className="flex items-center justify-center gap-2">
          <input 
            readOnly 
            value={`${window.location.origin}/game/${gameId}`} 
            className="input w-full max-w-md" 
          />
          <Button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/game/${gameId}`)}>
            Sao chép
          </Button>
        </div>
      </div>
    </div>
  );
};
```

## Các Bước Tiếp Theo

1. **Tạo Component QR Code**: Xây dựng component hiển thị mã QR từ gameId
2. **Tích Hợp Vào UI**: Thêm chức năng hiển thị QR code trong trang chia sẻ game
3. **Nâng Cao Tính Năng Theo Dõi**: Thêm chức năng theo dõi số lượng người tham gia từ mỗi liên kết
4. **Tối Ưu Hóa Lưu Trữ**: Cân nhắc chuyển từ localStorage sang IndexedDB hoặc backend nếu cần lưu trữ nhiều game
5. **Thêm Tính Năng Expire**: Tự động xóa các game hết hạn để tiết kiệm không gian lưu trữ
