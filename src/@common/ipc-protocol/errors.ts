export class TrojanError extends Error {
  constructor(readonly code: TrojanErrCode, message: string) {
    super(message);
  }
}
export enum TrojanErrCode {
  NoError = 0,
  ExecNotFound,
  FailingSpawn,
  InternalError = 500,
}
