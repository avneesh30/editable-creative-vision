
import React, { useState } from 'react';
import { X, Download, Share, Code, FileImage } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useEditor } from '../context';
import { ExportDialogProps } from '../types';
import { saveAs } from 'file-saver';

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'svg' | 'html'>('png');
  const [quality, setQuality] = useState<'normal' | 'high'>('normal');
  const [loading, setLoading] = useState(false);
  const { exportToImage, exportToHTML, downloadImage } = useEditor();

  const handleExport = async () => {
    setLoading(true);

    try {
      if (format === 'html') {
        // Handle HTML export
        const html = exportToHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'design.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'svg') {
        // Handle SVG export
        const svgData = await exportToImage('svg', quality);
        const blob = new Blob([decodeURIComponent(svgData.split(',')[1])], { type: 'image/svg+xml' });
        saveAs(blob, 'design.svg');
      } else {
        // Handle image export (PNG/JPEG)
        downloadImage(format as 'png' | 'jpeg', quality);
      }

      onExport(format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="image" className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="image">
              <FileImage className="h-4 w-4 mr-2" />
              Image
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              HTML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Format</div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={format === 'png' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('png')}
                >
                  PNG
                </Button>
                <Button
                  variant={format === 'jpeg' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('jpeg')}
                >
                  JPEG
                </Button>
                <Button
                  variant={format === 'svg' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('svg')}
                >
                  SVG
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Quality</div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={quality === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQuality('normal')}
                >
                  Normal
                </Button>
                <Button
                  variant={quality === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setQuality('high')}
                >
                  High
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">HTML Export</div>
              <p className="text-sm text-muted-foreground">
                Export your design as HTML to embed directly in websites.
              </p>
            </div>

            <div className="p-4 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground">
                The HTML output includes:
              </p>
              <ul className="list-disc list-inside text-xs text-muted-foreground mt-2">
                <li>SVG representation of your canvas</li>
                <li>Basic styling for web display</li>
                <li>No external dependencies</li>
              </ul>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setFormat('html')}
            >
              Export as HTML
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Download'}
              {!loading && <Download className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
