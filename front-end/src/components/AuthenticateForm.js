function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div className="App">
      <h1>Sign in</h1>
      <form action="/login" method="post">
        <section>
          <label for="username">Username</label>
          <input id="username" name="username" type="text" autocomplete="username" required autofocus />
        </section>
        <section>
          <label for="current-password">Password</label>
          <input id="current-password" name="password" type="password" autocomplete="current-password" required />
        </section>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

export default App;