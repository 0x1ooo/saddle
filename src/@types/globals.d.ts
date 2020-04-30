declare interface IServerEntry {
  getDetail(): ServerDetail;
}
declare interface ServerDetail {
  host: string;
  port: number;
}
declare let global: NodeJS.Global & {
  startupFinished: boolean;
  servers: {
    registerBuilder(type: number, builder: any);
    list(): ServerEntry[];
  };
};
