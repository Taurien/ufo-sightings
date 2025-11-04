interface ImportMetaEnv {
  readonly DB_HOST: string;
  readonly DB_USER: string;
  readonly DB_PASSWORD: string;
  readonly DB_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
