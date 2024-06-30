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

  const addMessage = () => {
    if (currentMessage) {
      setMessages([
        ...messages,
        { type: currentType, content: currentMessage },
      ]);
      setCurrentMessage("");
    }
  };

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

  if (liffError) {
    return <div>Error: {liffError}</div>;
  }

  if (!liffObject) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>LIFF Share Target Picker Demo</h1>
      <div>
        <select
          value={currentType}
          onChange={(e) => setCurrentType(e.target.value as MessageType)}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder={
            currentType === "text" ? "Enter message" : "Enter image URL"
          }
        />
        <button onClick={addMessage}>Add Message</button>
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            {msg.type}: {msg.content}
          </li>
        ))}
      </ul>
      <button onClick={shareMessages}>Share Messages</button>
    </div>
  );
}

export default App;
