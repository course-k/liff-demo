import { useState, useEffect } from "react";
import liff, { Liff } from "@line/liff";
import { SendMessagesParams } from "@liff/send-messages";

type MessageType = "text" | "image";

interface Message {
  type: MessageType;
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentType, setCurrentType] = useState<MessageType>("text");
  const [liffObject, setLiffObject] = useState<Liff>();
  const [liffError, setLiffError] = useState("");

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
      setLiffError(error instanceof Error ? error.message : String(error));
    }
  };

  // メッセージ追加処理
  const addMessage = () => {
    if (currentMessage) {
      setMessages([
        ...messages,
        { type: currentType, content: currentMessage },
      ]);
      setCurrentMessage("");
    }
  };

  // シェアターゲットピッカーによるメッセージシェア
  const shareMessages = async () => {
    if (!liffObject) {
      alert("LIFF is not initialized");
      return;
    }

    try {
      const liffMessages: SendMessagesParams = messages.map((msg) => {
        if (msg.type === "text") {
          return { type: "text", text: msg.content };
        } else {
          return {
            type: "image",
            originalContentUrl: msg.content,
            previewImageUrl: msg.content,
          };
        }
      });

      await liffObject.shareTargetPicker(liffMessages, {
        isMultiple: true,
      });
    } catch (error) {
      alert("Failed to share: " + error);
    }
  };

  // エラー表示
  if (liffError) {
    return <div>Error: {liffError}</div>;
  }

  // 初期化待ち表示
  if (!liffObject) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>シェアターゲットピッカー デモ</h1>
      <div>
        <select
          value={currentType}
          onChange={(e) => setCurrentType(e.target.value as MessageType)}
        >
          <option value="text">テキスト</option>
          <option value="image">画像</option>
        </select>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder={
            currentType === "text" ? "メッセージを入力" : "画像URLを入力"
          }
        />
        <button onClick={addMessage}>メッセージを追加</button>
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.type}: {msg.content}
          </li>
        ))}
      </ul>
      <button onClick={shareMessages}>メッセージをシェア</button>
    </div>
  );
}

export default App;
