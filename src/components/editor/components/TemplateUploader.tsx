
import React from 'react';
import { FileUploader } from './FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';

interface TemplateUploaderProps {
  onSuccess?: () => void;
}

export const TemplateUploader: React.FC<TemplateUploaderProps> = ({
  onSuccess
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Add Your Own Templates</CardTitle>
        <CardDescription>
          Upload PSD files to create reusable templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUploader
          acceptedTypes=".psd"
          maxSizeMB={25}
          saveAsTemplate={true}
          onSuccess={onSuccess}
        />
      </CardContent>
    </Card>
  );
};

export default TemplateUploader;
