import liff, { Liff } from "@line/liff";
import { useEffect, useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [liffObject, setLiffObject] = useState<Liff>();

  useEffect(() => {
    initializeLiff();
  }, []);

  // liffの初期化
  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true,
      });
      setLiffObject(liff);
    } catch (error) {
      console.log(error);
    }
  };

  // シェアターゲットピッカーによるメッセージシェア
  const shareMessage = async () => {
    if (!liffObject) {
      console.log("LIFF is not initialized");
      return;
    }

    try {
      await liffObject.shareTargetPicker([
        {
          type: "text",
          text: message,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  if (!liffObject) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>シェアターゲットピッカー デモ</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="メッセージを入力してください"
      />
      <button onClick={shareMessage}>メッセージをシェアする</button>
    </div>
  );
};

export default App;
