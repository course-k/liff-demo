import liff from "@line/liff";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    liff
      .init({ liffId: import.meta.env.VITE_LIFF_ID })
      .then(() => {
        console.log("init");
        console.log(liff);
      })
      .catch(() => {
        console.log("init failed");
      });
  }, []);
  const [userName, setUserName] = useState("名無し");
  liff
    .getProfile()
    .then((profile) => {
      console.log("get profile");
      console.log(liff);
      console.log(profile);
      setUserName(profile.displayName);
    })
    .catch(() => {
      console.log("get profile failed");
    });

  return (
    <>
      <h1>こんにちは、{userName}さん</h1>
    </>
  );
}

export default App;
