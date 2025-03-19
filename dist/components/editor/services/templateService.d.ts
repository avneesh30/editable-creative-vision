import { PsdTemplate } from '../types';
interface TemplateSaveData {
    name: string;
    thumbnailUrl: string;
    canvasJson: string;
    size: {
        width: number;
        height: number;
    };
    category: string;
}
export declare const fetchTemplatesFromFolder: () => Promise<PsdTemplate[]>;
export declare const fetchPexelsTemplates: (category?: string, page?: number) => Promise<PsdTemplate[]>;
export declare const saveTemplateToFolder: (templateData: TemplateSaveData) => Promise<boolean>;
export declare const loadTemplateJson: (jsonPath?: string) => Promise<string | null>;
export {};
