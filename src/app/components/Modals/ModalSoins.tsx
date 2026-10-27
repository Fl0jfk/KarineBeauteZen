"use client";

import { useSelector } from "react-redux";
import { modalState } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import Dropdown from "../Dropdown/Dropdown";
import ModalFrame from "./ModalFrame";

export default function ModalSoins() {
  const visible = useSelector((state: { modal: modalState }) => state.modal.modalSoins);
  const data = useData();
  const items = data.prestations[0]?.["Les soins visages et corps"];

  return (
    <ModalFrame visible={visible} title={data.categories[0]?.name ?? "Soins"}>
      {items && <Dropdown title="Les soins visages et corps" items={items} />}
    </ModalFrame>
  );
}
