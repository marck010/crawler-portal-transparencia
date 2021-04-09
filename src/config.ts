import env from "typed-env";

export const Config = env({
  PORT: { type: "number", optional: true, default: 8000 },
  NODE_ENV: { type: "string", optional: true, default: "production" },
  TZ: { type: "string", optional: true, default: "America/Sao_Paulo" },
  MONGO_DB_URL: { type: "string", optional: true, default: "mongodb://localhost:27017" },
  HEADLESS: { type: "boolean", optional: true, default: true },
  URL_SITE: { type: "string", optional: true, default: "http://www.portaltransparencia.gov.br/servidores/orgao" },
  TIME_WAIT_DEFAULT: { type: "number", optional: true, default: 1000 }
});
