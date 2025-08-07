import { APIGatewayProxyHandler } from 'aws-lambda';
import { ReceptionStatusTextResponse } from './types/ReceptionStatusText';

export const hello: APIGatewayProxyHandler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v4! Your function executed successfully!",
    }),
  };
};

export const getReceptionStatusText: APIGatewayProxyHandler = async (event) => {
  try {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // 時間帯による受付状況の判定
    const receptionInfo = getReceptionInfo(hour, minute);
    const isAvailable = receptionInfo.isAccepting;

    const response: ReceptionStatusTextResponse = {
      categories: {
        newPhoneAndDeviceChange: {
          items: [
            "新しい電話番号、機種変更",
            "SIM再発行・タイプ変更"
          ],
          isAvailable
        },
        carrierSwitch: {
          items: [
            "⚫︎⚫︎⚫︎⚫︎・△△△△△から乗り換え",
            "他社から乗り換え"
          ],
          isAvailable
        }
      },
      receptionInfo
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};

function getReceptionInfo(hour: number, minute: number) {
  // 4:00-23:15が受付時間
  const isWithinHours = (hour >= 4 && hour < 23) || (hour === 23 && minute <= 15);
  
  // 23:00以降は「まもなく終了」
  const isNearEnd = hour === 23 && minute > 0;

  if (isWithinHours) {
    if (isNearEnd) {
      return {
        status: "まもなく終了",
        hours: "(0:00~23:15)",
        isAccepting: true
      };
    } else {
      return {
        status: "受付中",
        hours: "(4:00~23:15)",
        isAccepting: true
      };
    }
  } else {
    return {
      status: "受付時間外",
      hours: "0:00から受付再開",
      isAccepting: false
    };
  }
}
