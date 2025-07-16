import React, { useState, useEffect } from 'react';
import { GameSettingsData, SettingsTemplate } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Download, 
  Trash2, 
  FileText, 
  Star,
  Clock,
  Copy,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsTemplateManagerProps {
  currentSettings: GameSettingsData;
  gameType: string;
  onLoadTemplate: (settings: GameSettingsData) => void;
}

export const SettingsTemplateManager: React.FC<SettingsTemplateManagerProps> = ({
  currentSettings,
  gameType,
  onLoadTemplate
}) => {
  const [templates, setTemplates] = useState<SettingsTemplate[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const { toast } = useToast();

  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('gameSettingsTemplates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error('Error loading templates:', error);
      }
    }
  }, []);

  // Save templates to localStorage
  const saveTemplatesToStorage = (newTemplates: SettingsTemplate[]) => {
    try {
      localStorage.setItem('gameSettingsTemplates', JSON.stringify(newTemplates));
      setTemplates(newTemplates);
    } catch (error) {
      console.error('Error saving templates:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu template",
        variant: "destructive"
      });
    }
  };

  const saveCurrentTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên template",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: SettingsTemplate = {
      id: Date.now().toString(),
      name: newTemplateName,
      description: newTemplateDescription,
      settings: currentSettings,
      gameType,
      createdAt: new Date()
    };

    const updatedTemplates = [...templates, newTemplate];
    saveTemplatesToStorage(updatedTemplates);

    toast({
      title: "Thành công",
      description: `Template "${newTemplateName}" đã được lưu`
    });

    setNewTemplateName('');
    setNewTemplateDescription('');
    setShowSaveDialog(false);
  };

  const loadTemplate = (template: SettingsTemplate) => {
    onLoadTemplate(template.settings);
    toast({
      title: "Đã tải",
      description: `Template "${template.name}" đã được áp dụng`
    });
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    saveTemplatesToStorage(updatedTemplates);
    
    toast({
      title: "Đã xóa",
      description: "Template đã được xóa"
    });
  };

  const duplicateTemplate = (template: SettingsTemplate) => {
    const duplicatedTemplate: SettingsTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date()
    };

    const updatedTemplates = [...templates, duplicatedTemplate];
    saveTemplatesToStorage(updatedTemplates);

    toast({
      title: "Đã sao chép",
      description: `Template "${duplicatedTemplate.name}" đã được tạo`
    });
  };

  const getTemplateTypeIcon = (template: SettingsTemplate) => {
    if (template.settings.timerMode === 'rush') return <Clock className="h-3 w-3 text-red-500" />;
    if (template.settings.timerMode === 'relaxed') return <Star className="h-3 w-3 text-green-500" />;
    return <FileText className="h-3 w-3 text-blue-500" />;
  };

  const getTemplateInfo = (settings: GameSettingsData) => {
    const info = [];
    if (settings.difficulty) info.push(settings.difficulty);
    if (settings.questionCount) info.push(`${settings.questionCount} câu`);
    if (settings.timerMode) info.push(settings.timerMode);
    return info.join(' • ');
  };

  const filteredTemplates = templates.filter(t => 
    !t.gameType || t.gameType === gameType || t.gameType === 'all'
  );

  return (
    <Card className="p-4 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Templates đã lưu</h3>
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <Save className="h-3 w-3 mr-1" />
              Lưu template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lưu Settings Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên template</label>
                <Input
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Ví dụ: Quiz nhanh, Memory dễ..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mô tả (tùy chọn)</label>
                <Textarea
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  placeholder="Mô tả ngắn gọn về template này..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveDialog(false)}
                >
                  Hủy
                </Button>
                <Button onClick={saveCurrentTemplate}>
                  Lưu template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chưa có template nào được lưu</p>
          <p className="text-xs">Lưu cài đặt hiện tại để sử dụng lại sau</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getTemplateTypeIcon(template)}
                  <span className="font-medium text-sm truncate">
                    {template.name}
                  </span>
                  {template.gameType && (
                    <Badge variant="outline" className="text-xs">
                      {template.gameType}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {getTemplateInfo(template.settings)}
                </p>
                {template.description && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {template.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => loadTemplate(template)}
                  title="Tải template"
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => duplicateTemplate(template)}
                  title="Sao chép template"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => deleteTemplate(template.id)}
                  title="Xóa template"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};