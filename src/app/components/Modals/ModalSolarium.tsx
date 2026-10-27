"use client";

import { useSelector } from "react-redux";
import { modalState } from "@/app/redux/reducers/modal";
import { useData } from "@/app/contexts/data";
import Dropdown from "../Dropdown/Dropdown";
import ModalFrame from "./ModalFrame";

const solariumWarning =
  "L'exposition aux rayonnements d'un appareil de bronzage peut provoquer des cancers de la peau et des yeux et est responsable d'un vieillissement cutané prématuré. L'existence d'une réglementation du bronzage artificiel ne permet pas d'éliminer les risques sanitaires encourus en cas d'exposition, en particulier le risque de cancer. L'utilisation de ces appareils est interdite aux personnes de moins de 18 ans. Porter les lunettes de protection fournies.";

export default function ModalSolarium() {
  const visible = useSelector((state: { modal: modalState }) => state.modal.modalSolarium);
  const data = useData();
  const items = data.prestations[0]?.["Solarium"];

  return (
    <ModalFrame visible={visible} title={data.categories[5]?.name ?? "Solarium"}>
      <aside role="alert" className="border border-amber-800/40 bg-amber-50 p-4 text-amber-950">
        <p className="text-sm leading-relaxed md:text-base">
          <strong>Attention !</strong> {solariumWarning}
        </p>
      </aside>
      {items && <Dropdown title="Solarium" items={items} />}
    </ModalFrame>
  );
}
