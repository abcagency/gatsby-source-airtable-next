"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaCustomization =
  exports.onPostBuild =
  exports.sourceNodes =
    void 0;
const airtable_1 = __importDefault(require("airtable"));
const lodash_1 = __importDefault(require("lodash"));
const NODE_TYPE = "Airtable";
// https://www.gatsbyjs.org/docs/node-apis/#sourceNodes
const sourceNodes = async (args, options) => {
  const { actions, createNodeId, createContentDigest, reporter } = args;
  const { createNode } = actions;
  const now = new Date();
  try {
    const promises = options.tables.map(async (table) => {
      return new Promise((resolve, reject) => {
        const now = new Date();
        const data = [];
        const base = new airtable_1.default({ apiKey: options.apiKey }).base(
          table.baseId
        );
        base(table.tableName)
          .select({
            view: table.tableView,
          })
          .eachPage(
            function page(records, fetchNextPage) {
              // This function (`page`) will get called for each page of records.
              records.forEach(function (record) {
                const fields = lodash_1.default.mapKeys(
                  record.fields,
                  (_v, k) => lodash_1.default.camelCase(k)
                );
                data.push({
                  airtableId: record.getId(),
                  table: table.tableName,
                  data: fields,
                });
              });
              // To fetch the next page of records, call `fetchNextPage`.
              // If there are more records, `page` will get called again.
              // If there are no more records, `done` will get called.
              fetchNextPage();
            },
            function done(err) {
              if (err) {
                reject(err);
                return;
              }
              // Loop through data and create Gatsby nodes
              data.forEach((entry) =>
                createNode(
                  Object.assign(Object.assign({}, entry), {
                    id: createNodeId(`${NODE_TYPE}-${entry.airtableId}`),
                    parent: null,
                    children: [],
                    internal: {
                      type: NODE_TYPE,
                      content: JSON.stringify(entry),
                      contentDigest: createContentDigest(entry),
                    },
                  })
                )
              );
              const seconds = (Date.now() - now.getTime()) / 1000;
              reporter.success(
                `Created ${data.length} nodes from Airtable ${table.tableName} - ${seconds}s`
              );
              // Done! 🎉
              resolve();
            }
          );
      });
    });
    await Promise.all(promises);
    const seconds = (Date.now() - now.getTime()) / 1000;
    reporter.success(`Creating nodes from Airtable tables - ${seconds}s`);
  } catch (error) {
    console.error(
      "Uh-oh, something went wrong with Airtable node creation.",
      error
    );
  }
  // get the last timestamp from the cache
  // const lastFetched = await cache.get(`timestamp`);
};
exports.sourceNodes = sourceNodes;
// https://www.gatsbyjs.org/docs/node-apis/#onPostBuild
const onPostBuild = async (args) => {
  const { cache } = args;
  // TODO: use this :)
  // set a timestamp at the end of the build
  await cache.set("timestamp", Date.now());
};
exports.onPostBuild = onPostBuild;
const createSchemaCustomization = (args, options) => {
  const now = new Date();
  const { actions, reporter } = args;
  const { createTypes } = actions;
  const strings = [];
  options.tables.forEach((table) => {
    var _a;
    (_a = table.tableLinks) === null || _a === void 0
      ? void 0
      : _a.forEach((link) => {
          const cc = lodash_1.default.camelCase(link);
          strings.push(`type AirtableData implements Node {
        ${cc}: [Airtable] @link(by: "airtableId", from: "${cc}")
      }`);
        });
  });
  const typeDefs = strings.join(`
    `);
  createTypes(typeDefs);
  const seconds = (Date.now() - now.getTime()) / 1000;
  reporter.success(`Building Airtable schema - ${seconds}s`);
};
exports.createSchemaCustomization = createSchemaCustomization;
//# sourceMappingURL=gatsby-node.js.map
