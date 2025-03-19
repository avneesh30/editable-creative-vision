
import React, { useState, useEffect } from 'react';
import { X, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ShareDialogProps } from '../types';
import { toast } from "sonner";

const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose, imageDataUrl }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyLink = () => {
    if (!imageDataUrl) return;

    navigator.clipboard.writeText(imageDataUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
  };

  const handleShareSocial = (platform: string) => {
    if (!imageDataUrl) return;

    // In a real implementation, you would use the Web Share API
    // or platform-specific share URLs
    toast.success(`Sharing on ${platform}`);

    // Example implementation for Twitter:
    // window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(imageDataUrl)}&text=Check out my design!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Design</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {imageDataUrl && (
            <div className="border border-border rounded-md p-2 flex justify-center">
              <img
                src={imageDataUrl}
                alt="Your design"
                className="max-h-48 object-contain"
              />
            </div>
          )}

          <div className="flex space-x-2">
            <Input
              value={imageDataUrl || "Generate a preview first"}
              readOnly
              className="flex-1 text-xs truncate"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              disabled={!imageDataUrl}
            >
              {copied ? 'Copied!' : 'Copy'}
              <Copy className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-sm font-medium mb-2">Share on Social Media</div>
            <div className="flex space-x-3 justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShareSocial('Facebook')}
                disabled={!imageDataUrl}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShareSocial('Twitter')}
                disabled={!imageDataUrl}
              >
                <Twitter className="h-5 w-5 text-sky-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShareSocial('LinkedIn')}
                disabled={!imageDataUrl}
              >
                <Linkedin className="h-5 w-5 text-blue-700" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShareSocial('Email')}
                disabled={!imageDataUrl}
              >
                <Mail className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
