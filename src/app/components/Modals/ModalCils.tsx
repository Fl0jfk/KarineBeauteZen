"use client";

import { useSelector } from "react-redux";
import { modalState } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import Dropdown from "../Dropdown/Dropdown";
import ModalFrame from "./ModalFrame";

export default function ModalCils() {
  const visible = useSelector((state: { modal: modalState }) => state.modal.modalCils);
  const data = useData();
  const teinture = data.prestations[0]?.["Teinture de sourcils et cils, réhaussement de cils"];
  const extensions = data.prestations[0]?.["Extensions de cils"];

  return (
    <ModalFrame visible={visible} title={data.categories[3]?.name ?? "Cils et sourcils"}>
      {teinture && (
        <Dropdown title="Teinture de sourcils et cils, réhaussement de cils" items={teinture} />
      )}
      {extensions && <Dropdown title="Extensions de cils" items={extensions} />}
    </ModalFrame>
  );
}
