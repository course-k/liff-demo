import liff from "@line/liff";
import { useEffect, useState } from "react";

function App() {
  const [userName, setUserName] = useState("名無し");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        console.log("init");
        setIsLoggedIn(liff.isLoggedIn());
        liff
          .getProfile()
          .then((profile) => {
            console.log("get profile");
            setUserName(profile.displayName);
          })
          .catch(() => {
            console.log("get profile failed");
          });
      })
      .catch(() => {
        console.log("init failed");
      });
  }, []);

  return (
    <>
      <h1>{isLoggedIn ? `こんにちは、${userName}さん` : "Loading..."}</h1>
    </>
  );
}

export default App;
