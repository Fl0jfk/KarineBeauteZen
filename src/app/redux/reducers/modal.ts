import { createSlice } from '@reduxjs/toolkit';

export type modalState = {
    modal:boolean;
    modalSoins:boolean;
    modalManucure:boolean;
    modalEpilation:boolean;
    modalCils:boolean;
    modalMaquillage:boolean;
    modalSolarium:boolean;
}

const initialState : modalState = {
    modal:false,
    modalSoins:false,
    modalManucure:false,
    modalEpilation:false,
    modalCils:false,
    modalMaquillage:false,
    modalSolarium:false,
 };

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModalClose: state => {
            state.modal=false;
            state.modalSoins=false;
            state.modalManucure=false;
            state.modalEpilation=false;
            state.modalCils=false;
            state.modalMaquillage=false;
            state.modalSolarium=false;
        },
        setModalOpenSoins: state => {
            state.modal=true;
            state.modalSoins=true;
        },
        setModalOpenManucure: state => {
            state.modal=true;
            state.modalManucure=true;
        },
        setModalOpenEpilation: state => {
            state.modal=true;
            state.modalEpilation=true;
        },
        setModalOpenCils: state => {
            state.modal=true;
            state.modalCils=true;
        },
        setModalOpenMaquillage: state => {
            state.modal=true;
            state.modalMaquillage=true;
        },
        setModalOpenSolarium: state => {
            state.modal=true;
            state.modalSolarium=true;
        }
    },
});
  
export const{setModalClose, setModalOpenSoins, setModalOpenManucure, setModalOpenEpilation, setModalOpenCils, setModalOpenMaquillage, setModalOpenSolarium} = modalSlice.actions;

export default modalSlice.reducer;