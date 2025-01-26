import { useAgencyStore } from "@/stores/agencyStore";
import type {
  AGENCY_DELIVERY_TYPE,
  DELIVERY_TYPE_STANDARD,
} from "@/types/agency.types";
import { reactive } from "vue";

export const useCreateAgencyHook = () => {
  const state = reactive({
    deliveryType: <AGENCY_DELIVERY_TYPE[]>[
      {
        icon: "RiCarLine",
        name: "Standard",
        describe: "Moto, vélo, vechule, gare, etc...",
      },
      // {
      //   icon: "RiTruckLine",
      //   name: "FOURGONS",
      //   describe: "Vous livrez de gros colis ?",
      // },
      // {
      //   icon: "RiBusLine",
      //   name: "DEMENAGEMENT",
      //   describe: "Vous faite du demenagements ?",
      // },
      // {
      //   icon: "RiShipLine",
      //   name: "Expedition",
      //   describe: "Avion, bateau et train...",
      // },
    ],
    in_standard: <DELIVERY_TYPE_STANDARD>{
      name: "",
      price: "0.00",
    },
  });

  // Set variable
  const AgencyStore = useAgencyStore();

  // 
  const AddNewPlace = (type:string, inputData:DELIVERY_TYPE_STANDARD, callback:any) => {
    console.log(AgencyStore.DATA_type_delivery_standard)
    type === "Standard" ? AgencyStore.DATA_type_delivery_standard.unshift({name: inputData.name, price: inputData.price}) : null

    callback()
  }

  return {
    state,
    AddNewPlace
  };
};
