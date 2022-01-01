import axios from "axios";
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [jokes, setJokes] = useState<any>([]);
  const [listening, setListening] = useState(false);
  const [userJoke, setUserJoke] = useState("");
  const [author, setAuthor] = useState("");
  useEffect(() => {
    if (!listening) {
      const events = new EventSource("http://localhost:5000/events");

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setJokes((jokes: any) => jokes.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, jokes]);

  function submitHandler() {
    axios.post("http://localhost:5000/jokes", {
      joke: userJoke,
      author: author,
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Joke Machine</h1>
        <div className="App-body">
          <form className="App-form" onSubmit={submitHandler}>
            <label className="font-black"> Joke </label>
            <input
              type="text"
              placeholder="Joke"
              value={userJoke}
              onChange={(e) => setUserJoke(e.target.value)}
            />
            <label className="font-black"> Author</label>
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <button type="submit" className="submit">
              Submit
            </button>
          </form>

          <table className="stats-table">
            <thead>
              <tr>
                <th>Joke</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {jokes.map((joke: any, i: any) => (
                <tr key={i}>
                  <td>{joke.joke}</td>
                  <td>{joke.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>
    </div>
  );
}

export default App;
