export interface AllReceptionTextsResponse {
  receptionStatuses: {
    accepting: {
      status: string;
      hours: string;
      isAccepting: boolean;
    };
    nearEnd: {
      status: string;
      hours: string;
      isAccepting: boolean;
    };
    closed: {
      status: string;
      hours: string;
      isAccepting: boolean;
    };
  };
}
