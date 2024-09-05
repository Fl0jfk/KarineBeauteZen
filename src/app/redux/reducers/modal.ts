import { createSlice } from '@reduxjs/toolkit';

export type modalState = {
    modal:boolean;
    modalArtistic:boolean;
    modalBoudoir:boolean;
    modalBoudoirTexture:boolean;
    modalMomentsLife:boolean;
    modalOutside:boolean;
    modalPortrait:boolean;
    modalPregnancy:boolean;
    modalPhotos:boolean;
    nameLinkPhotosUp: string;
    cameraLinkPhotosUp: string;
    softwareLinkPhotosUp: string;
    latitudePhotosUp: number;
    longitudePhotosUp: number;
    previousModal: string;
}

const initialState : modalState = {
    modal:false,
    modalArtistic:false,
    modalBoudoir:false,
    modalBoudoirTexture:false,
    modalMomentsLife:false,
    modalOutside:false,
    modalPortrait:false,
    modalPregnancy:false,
    modalPhotos:false,
    nameLinkPhotosUp: "",
    cameraLinkPhotosUp: "",
    softwareLinkPhotosUp: "",
    latitudePhotosUp: 0,
    longitudePhotosUp: 0,
    previousModal:""
 };

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModalClose: state => {
            state.modal=false;
            state.modalArtistic=false;
            state.modalBoudoir=false;
            state.modalBoudoirTexture=false;
            state.modalMomentsLife=false;
            state.modalOutside=false;
            state.modalPortrait=false;
            state.modalPregnancy=false;
            state.modalPhotos=false;
        },
        setModalOpenArtistic: state => {
            state.modal=true;
            state.modalArtistic=true;
            state.modalPhotos=false;
        },
        setModalOpenBoudoir: state => {
            state.modal=true;
            state.modalBoudoir=true;
            state.modalPhotos=false;
        },
        setModalOpenBoudoirTexture: state => {
            state.modal=true;
            state.modalBoudoirTexture=true;
            state.modalPhotos=false;
        },
        setModalOpenMomentsLife: state => {
            state.modal=true;
            state.modalMomentsLife=true;
            state.modalPhotos=false;
        },
        setModalOpenOutside: state => {
            state.modal=true;
            state.modalOutside=true;
            state.modalPhotos=false;
        },
        setModalOpenPortrait: state => {
            state.modal=true;
            state.modalPortrait=true;
            state.modalPhotos=false;
        },
        setModalOpenPregnancy: state => {
            state.modal=true;
            state.modalPregnancy=true;
            state.modalPhotos=false;
        },
        setModalOpenPhotos: state => {
            state.modal=true;
            state.modalPhotos=true;
            state.modalArtistic=false;
            state.modalBoudoir=false;
            state.modalBoudoirTexture=false;
            state.modalMomentsLife=false;
            state.modalOutside=false;
            state.modalPortrait=false;
            state.modalPregnancy=false;
        },
        setPhotoDetails: (state, action) => {
            state.nameLinkPhotosUp = action.payload.nameLinkPhotosUp;
            state.cameraLinkPhotosUp = action.payload.cameraLinkPhotosUp;
            state.latitudePhotosUp = action.payload.latitudePhotosUp;
            state.longitudePhotosUp = action.payload.longitudePhotosUp;
            state.previousModal = action.payload.previousModal;   
            state.softwareLinkPhotosUp = action.payload.softwareLinkPhotosUp;  
        }
    },
});
  
export const{setModalClose, setModalOpenArtistic, setModalOpenBoudoir, setModalOpenBoudoirTexture, setModalOpenMomentsLife, setModalOpenOutside, setModalOpenPortrait, setModalOpenPregnancy, setModalOpenPhotos, setPhotoDetails} = modalSlice.actions;

export default modalSlice.reducer;