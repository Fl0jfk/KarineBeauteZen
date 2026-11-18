import { createContext, useContext, PropsWithChildren } from "react";

type Categories = {
  id: number;
  name: string;
  img: string;
  shortDescription: string;
  description: string;
};

type Prestation = {
  id: number;
  title: string;
  price: number;
  time: string;
  description?: string;
};

type CategoriePrestation = {
  [categoryName: string]: Prestation[];
};

type Reviews = {
  id:number;
  imageUser:string;
  nameUser:string;
  rating:number;
  message:string;
  link:string;
}

type Team = {
  id:number;
  firstname:string;
  lastname:string;
  profession:string;
  pp:string;
}

type Brands = {
  id:number;
  name:string;
  logo:string;
}

type Shop = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export type Data = {
  profile: {
    firstname: string;
  lastname: string;
  profession: string;
  enterprise: string;
  logo: string;
  telephone: string;
  mobile: string;
  adress: string;
  postalcode: string;
  city: string;
  };
  categories: Categories[];
  prestations: CategoriePrestation[];
  reviews: Reviews[];
  team:Team[];
  brands:Brands[];
  shop: Shop[];
  error: string | null;
};

const initialData: Data = {
  profile: {
    firstname: "",
    lastname: "",
    profession: "",
    enterprise: "",
    logo: "",
    telephone: "",
    mobile: "",
    adress: "",
    postalcode: "",
    city: ""
  },
  categories: [],
  prestations:[],
  shop: [],
  team:[],
  brands:[],
  reviews:[],
  error: null
};

const DataContext = createContext<Data | undefined>(undefined);

export const DataProvider = ({ children, initialData: serverData }: PropsWithChildren<{ initialData?: Data }>) => (
  <DataContext.Provider value={serverData ?? initialData}>{children}</DataContext.Provider>
);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};