import {create} from 'zustand';

const useStore = create((set) => ({
  step: 'email', 
  setStep: (newStep) => set({ step: newStep }), 
}));

export default useStore;