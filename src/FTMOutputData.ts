import FTMFormType from "./FTMFormType";

interface FTMOutputData {
  //Formica time yapısı ile de gönderilebilir
  start?: number,
  fullElementPath?: Array<string>,
  elementClasses?: string,
  elementId?: string,
  elementTarget?: string,
  elementUrl?: string,
  newUrl?: string,
  newPath?: string,
  newHostname?: string,
  currentPath?: string,
  currentHostname?: string,
  //currentUrl ve oldUrl çoğu zaman aynı oluyor biri silinebilir.
  currentUrl?: string,
  oldUrl?: string,
  FormData?: Array<FTMFormType>

}

export default FTMOutputData;
