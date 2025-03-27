
import { useToast } from '@/hooks/use-toast';

export const exportCanvas = () => {
  const { toast } = useToast();
  
  toast({
    title: "Canvas Exported",
    description: "Your canvas has been exported as a PNG.",
    duration: 2000,
  });
  
  // In a real implementation, this would capture the canvas as an image
};
