import { PsdTemplate, UserTemplate } from '../types';
export declare const usePsdTemplates: () => {
    loadPsdTemplate: (file: File) => Promise<boolean>;
    getPsdTemplates: () => Promise<PsdTemplate[]>;
    getUserTemplates: () => UserTemplate[];
    loadDemoTemplate: (template: PsdTemplate) => void;
    loadUserTemplate: (template: UserTemplate) => void;
    saveAsTemplate: (name: string, category: string, thumbnailUrl?: string) => boolean;
    deleteUserTemplate: (templateId: string) => void;
    loadTemplateFromFolder: (template: PsdTemplate) => Promise<void>;
    uploadPsdAsTemplate: (file: File) => Promise<boolean>;
};
export default usePsdTemplates;
