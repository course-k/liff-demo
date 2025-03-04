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
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    initializeLiff();
  }, []);

  // liffの初期化
  const initializeLiff = async () => {
    try {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true, // 外部ブラウザでの自動ログイン
      });

      // ログイン状態の確認のみ（明示的なログイン処理は行わない）
      const loggedIn = liff.isLoggedIn();
      setIsLoggedIn(loggedIn);
      setLiffObject(liff);

      if (!loggedIn) {
        console.log("User is not logged in");
        // ここで明示的なログイン処理は行わない
        // LIFFが適切に初期化され、withLoginOnExternalBrowserが
        // 設定されていれば自動的にログイン処理が行われる
      }
    } catch (error) {
      setLiffError(error instanceof Error ? error.message : String(error));
    }
  };

  // ログアウト処理
  const handleLogout = () => {
    if (liffObject && isLoggedIn) {
      try {
        liffObject.logout();
        setIsLoggedIn(false);
        setMessages([]);

        // ログアウト後はページをリロードして初期状態に戻す
        // これによりLIFF SDKが適切に再初期化される
        window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);
        alert("ログアウトに失敗しました");
      }
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

    if (!isLoggedIn) {
      alert("LINEにログインしていません。ページを再読み込みしてください。");
      return;
    }

    if (messages.length === 0) {
      alert("メッセージを追加してください");
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

  // ログイン状態に応じたUIの表示
  // 明示的なログインボタンは表示しない
  return (
    <div>
      <h1>シェアターゲットピッカー デモ</h1>
      {isLoggedIn ? (
        <>
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
          <div>
            <button onClick={handleLogout}>ログアウト</button>
          </div>
        </>
      ) : (
        <div>
          <p>
            LINEにログインしていません。このアプリはLINEログインが必要です。
          </p>
          <p>
            ページを再読み込みするか、LINEアプリから再度アクセスしてください。
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
