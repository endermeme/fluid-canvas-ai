
import React from 'react';
import { Image } from 'lucide-react';
import { generatePlaceholderImage } from '../../../generator/imageInstructions';

interface PictionaryImageProps {
  imageUrl: string;
  answer: string;
  imageLoaded: boolean;
  imageError: boolean;
  onLoad: () => void;
  onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const PictionaryImage: React.FC<PictionaryImageProps> = ({
  imageUrl,
  answer,
  imageLoaded,
  imageError,
  onLoad,
  onError,
}) => {
  return (
    <div className="relative w-full max-w-md aspect-video mx-auto mb-4 bg-secondary/30 rounded-lg overflow-hidden border border-primary/20">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {imageError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <Image className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Không thể tải hình ảnh</p>
        </div>
      ) : (
        <img 
          src={imageUrl} 
          alt={`Hình ảnh: ${answer}`}
          className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
          onLoad={onLoad}
          onError={onError}
        />
      )}
    </div>
  );
};

export default PictionaryImage;
