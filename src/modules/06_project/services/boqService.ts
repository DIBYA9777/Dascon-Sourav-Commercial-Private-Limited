import { BOQ, BOQItem } from '../types';
import { projectService } from './projectService';

export const boqService = {
  getBOQs: (): BOQ[] => {
    return projectService.getBOQs();
  },
  
  getBOQSaved: (): BOQ[] => {
    return projectService.getBOQs();
  },

  getBOQByProject: (projectId: string): BOQ | undefined => {
    return projectService.getBOQByProject(projectId);
  },
  
  saveBOQs: (boqList: BOQ[]) => {
    projectService.saveBOQs(boqList);
  },
  
  createOrUpdateBOQ: (boq: BOQ) => {
    projectService.createOrUpdateBOQ(boq);
  },
  
  deleteBOQ: (id: string) => {
    const list = projectService.getBOQs();
    const filtered = list.filter(b => b.id !== id);
    projectService.saveBOQs(filtered);
  }
};
