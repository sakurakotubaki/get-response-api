export interface ReceptionStatusTextResponse {
  categories: {
    newPhoneAndDeviceChange: {
      items: string[];
      isAvailable: boolean;
    };
    carrierSwitch: {
      items: string[];
      isAvailable: boolean;
    };
  };
  receptionInfo: {
    status: string;        // "受付中" | "受付時間外" | "まもなく終了"
    hours: string;         // "(4:00~23:15)"
    isAccepting: boolean;  // ボタンの状態
  };
}
