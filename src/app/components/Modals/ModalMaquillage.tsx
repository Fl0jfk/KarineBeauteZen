"use client";

import { useSelector } from "react-redux";
import { modalState } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import Dropdown from "../Dropdown/Dropdown";
import ModalFrame from "./ModalFrame";

export default function ModalMaquillage() {
  const visible = useSelector((state: { modal: modalState }) => state.modal.modalMaquillage);
  const data = useData();
  const items = data.prestations[0]?.["Maquillage"];

  return (
    <ModalFrame visible={visible} title={data.categories[4]?.name ?? "Maquillage"}>
      {items && <Dropdown title="Maquillage" items={items} />}
    </ModalFrame>
  );
}
