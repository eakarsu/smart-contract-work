// Examples read configuration from the operator's environment. Never commit
// wallet keys or provider credentials to this repository.
export const configs = {
  ADDRESS: process.env.WALLET_ADDRESS ?? "",
  PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY ?? "",
  HTTP_URL: process.env.RPC_URL ?? "",
  SUB_GRAPH_ENDPOINT: process.env.SUBGRAPH_URL ?? "",
};
