
import React, { createContext, useContext } from 'react';
import { EditorContextType } from '../types';
import { EditorProvider as EditorProviderImplementation } from './EditorProvider';

// Create the context with null as initial value
const EditorContext = createContext<EditorContextType | null>(null);

// Hook to use the editor context
export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

// Provider component that wraps the implementation
interface EditorProviderProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  initialTemplate?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ 
  children, 
  initialWidth, 
  initialHeight, 
  initialTemplate 
}) => {
  return (
    <EditorProviderImplementation 
      initialWidth={initialWidth} 
      initialHeight={initialHeight}
      initialTemplate={initialTemplate}
    >
      {children}
    </EditorProviderImplementation>
  );
};

// Export the context for the provider implementation
export { EditorContext };
