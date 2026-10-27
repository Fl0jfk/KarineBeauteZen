"use client";

import { useSelector } from "react-redux";
import { modalState } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import Dropdown from "../Dropdown/Dropdown";
import ModalFrame from "./ModalFrame";

export default function ModalManucure() {
  const visible = useSelector((state: { modal: modalState }) => state.modal.modalManucure);
  const data = useData();
  const manucure = data.prestations[0]?.Manucure?.[0] as unknown as
    | Record<string, Array<{ id: number; title: string; price: number }>>
    | undefined;

  return (
    <ModalFrame visible={visible} title={data.categories[1]?.name ?? "Manucure"}>
      {manucure && (
        <>
          <Dropdown
            title="Gel et Semi Permanent Mains et Pieds"
            items={manucure["Gel et Semi Permanent Mains et Pieds"]}
          />
          <Dropdown
            title="Dépose Gel et Semi Permanent Mains et Pieds"
            items={manucure["Dépose Gel et Semi Permanent Mains et Pieds"]}
          />
          <Dropdown title="Pour les ongles naturels" items={manucure["Pour les ongles naturels"]} />
        </>
      )}
    </ModalFrame>
  );
}
