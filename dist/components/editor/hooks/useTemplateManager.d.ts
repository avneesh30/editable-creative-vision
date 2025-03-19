import { PsdTemplate, UserTemplate } from '../types';
export declare const useTemplateManager: () => {
    getPsdTemplates: () => PsdTemplate[];
    getUserTemplates: () => UserTemplate[];
    loadDemoTemplate: (template: PsdTemplate) => void;
    loadPexelsTemplate: (template: PsdTemplate) => void;
    loadUserTemplate: (template: UserTemplate) => void;
    saveAsTemplate: (name: string, category: string, thumbnailUrl?: string) => boolean;
    deleteUserTemplate: (templateId: string) => void;
    loadTemplateFromFolder: (template: PsdTemplate) => Promise<void>;
};
export default useTemplateManager;
