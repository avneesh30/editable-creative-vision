
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { FileUploader } from './FileUploader';

interface IllustratorTemplateUploaderProps {
  onSuccess?: () => void;
}

export const IllustratorTemplateUploader: React.FC<IllustratorTemplateUploaderProps> = ({
  onSuccess
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Add Illustrator Templates</CardTitle>
        <CardDescription>
          Upload Adobe Illustrator (.ai) files to create custom templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUploader
          acceptedTypes=".ai"
          maxSizeMB={25}
          saveAsTemplate={true}
          uploadType="illustrator"
          onSuccess={onSuccess}
        />
      </CardContent>
    </Card>
  );
};

export default IllustratorTemplateUploader;
