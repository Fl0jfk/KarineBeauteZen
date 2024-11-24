import { createContext, useCallback, useContext, useEffect, useState, PropsWithChildren } from "react";

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

type Data = {
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

export const DataProvider = ({ children }: PropsWithChildren<{}>) => {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Data | undefined>(undefined);
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("https://karinebeautezen.s3.eu-west-3.amazonaws.com/data.json");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData: Data = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <DataContext.Provider value={data || initialData}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};