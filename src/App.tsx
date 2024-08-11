import liff from "@line/liff";

function App() {
  const isInClient = liff.isInClient();

  return (
    <>
      {isInClient ? (
        <h1>LIFFブラウザによるアクセスです</h1>
      ) : (
        <h1>外部ブラウザによるアクセスです</h1>
      )}
    </>
  );
}

export default App;
