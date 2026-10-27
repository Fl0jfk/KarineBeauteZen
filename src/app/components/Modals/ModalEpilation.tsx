"use client";

import { useSelector } from "react-redux";
import { modalState } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import Dropdown from "../Dropdown/Dropdown";
import ModalFrame from "./ModalFrame";

export default function ModalEpilation() {
  const visible = useSelector((state: { modal: modalState }) => state.modal.modalEpilation);
  const data = useData();
  const items = data.prestations[0]?.["Épilations"];

  return (
    <ModalFrame visible={visible} title={data.categories[2]?.name ?? "Épilation"}>
      {items && <Dropdown title="Épilations" items={items} />}
    </ModalFrame>
  );
}
