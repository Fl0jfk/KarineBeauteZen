import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type userState = {
    email:string;
    city:string;
    line1:string;
    postal_code:string;
    name: string;
    price: number;
    title: string;
    image:string;
}

const initialState : userState = {
    email:"",
    city:"",
    line1:"",
    postal_code:"",
    name:"",
    price: 0,
    title: "",
    image:""
 };

const buySlice = createSlice({
    name: 'buy',
    initialState,
    reducers: {
        setInfoUser: (state, action: PayloadAction<any>) => {
            state.email=action.payload.email;
            state.city=action.payload.city;
            state.line1=action.payload.line1;
            state.postal_code=action.payload.postal_code;
            state.name=action.payload.name;
        },
        setDeleteInfoUser: state => {
            state.email="";
            state.city="";
            state.line1="";
            state.postal_code="";
            state.name="";
        },
        setInfoProduct: (state, action: PayloadAction<any>)=> {
            state.price=action.payload.price;
            state.title=action.payload.title;
            state.image=action.payload.image;
        },
        setDeleteInfoProduct: state => {
            state.price=0
            state.title=""
            state.image=""
        },
    },
});
  
export const {setInfoUser, setDeleteInfoUser, setInfoProduct, setDeleteInfoProduct} = buySlice.actions;

export default buySlice.reducer;