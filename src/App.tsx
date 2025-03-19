import React from 'react';
import logo from './logo.svg';
import './index.css';
import { MyPlugin } from './index1';
import { TooltipProvider } from './components/ui/tooltip';
import DesignEditor from './components/editor/DesignEditor';
import { Toaster } from './components/ui/toaster';
import { Toaster as Sonner } from './components/ui/sonner';
function App() {
  return (
      <div className="design-editor-plugin">
        <TooltipProvider>
          <DesignEditor {...{}} />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </div>
  );
}

export default App;
