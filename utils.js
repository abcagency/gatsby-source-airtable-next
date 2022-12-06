"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtension = exports.isAttachmentField = exports.pascalCase = void 0;
const lodash_1 = __importDefault(require("lodash"));
const pascalCase = (str) =>
  lodash_1.default.startCase(lodash_1.default.camelCase(str)).replace(/ /g, "");
exports.pascalCase = pascalCase;
const isAttachmentField = (obj) => {
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
exports.isAttachmentField = isAttachmentField;
const getExtension = (type) => {
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
exports.getExtension = getExtension;
