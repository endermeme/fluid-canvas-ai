
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Settings, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PresetGame {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  htmlContent: string;
}

interface PresetGameManagerProps {
  games: PresetGame[];
  onGameSelect: (game: PresetGame) => void;
  onGameCustomize?: (game: PresetGame) => void;
  onGameShare?: (game: PresetGame) => void;
}

const PresetGameManager: React.FC<PresetGameManagerProps> = ({
  games,
  onGameSelect,
  onGameCustomize,
  onGameShare
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(games.map(game => game.category)))];
  
  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'TB';
      case 'hard': return 'Khó';
      default: return 'N/A';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Tất cả' : category}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map(game => (
          <Card key={game.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-1">{game.title}</CardTitle>
                <Badge className={getDifficultyColor(game.difficulty)}>
                  {getDifficultyText(game.difficulty)}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {game.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>⏱️ {game.estimatedTime} phút</span>
                <span>📂 {game.category}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => onGameSelect(game)}
                  className="flex-1"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Chơi
                </Button>
                
                {onGameCustomize && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onGameCustomize(game)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
                
                {onGameShare && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onGameShare(game)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Không tìm thấy game nào trong danh mục này</p>
        </div>
      )}
    </div>
  );
};

export default PresetGameManager;
