import _ from "lodash";

export const pascalCase = (str: string) =>
  _.startCase(_.camelCase(str)).replace(/ /g, "");

export const isAttachmentField = (obj: { [key: string]: any }) => {
  if (
    obj.id &&
    obj.url &&
    obj.type &&
    obj.filename
  ) {
    return true;
  }

  return false;
};

export const getExtension = (type: string) => {
  let extension = type.split("/")[1];
  switch (extension) {
    case "jpeg":
      extension = ".jpg";
      break;
    case "svg+xml":
      extension = ".svg";
      break;
    case ".document":
      extension = ".docx";
    default:
      extension = `.${extension}`;
      break;
  }
  return extension;
};
