export type AirtablePluginOptions = {
  apiKey: string;
  refreshInterval: number;
  tables: {
    baseId: string;
    tableName: string;
    tableView?: string;
    recordLinks?: {
      fromField: string;
      toTable: string;
    }[];
    downloadLocal?: string[];
  }[];
};

export type AirtableAttachment = {
  id: string;
  isImage: boolean;
  height: number;
  width: number;
  url: string;
  type: string;
  thumbnails: {
    small: {
      url: string;
    };
  };
};
