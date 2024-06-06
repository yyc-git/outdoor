import { getBodyOriginName, getOriginName } from "../../Cabinet";

export let getType = () => "type3"

export let buildCabinetBodyName = (cabinetNumber: number) => {
    return `${getBodyOriginName()}_${getType()}_${cabinetNumber}`
}
