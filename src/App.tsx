import liff from "@line/liff";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
  }, []);
  const [userName, setUserName] = useState("名無し");
  liff.getProfile().then((profile) => {
    setUserName(profile.displayName);
  });

  return (
    <>
      <h1>こんにちは、{userName}さん</h1>
    </>
  );
}

export default App;
