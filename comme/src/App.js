import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [val, setVal] = useState("");
  const [turn, setTurn] = useState("computer");
  const [time, setTime] = useState(59);
  const [msg, setMsg] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [firstTurn, setFirstTurn] = useState(true);
  const [showbutton,setShowButton] = useState(true);

  const randomChar = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVW";
    text = possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };
  const startGame =()=>{
    let newVal;
  
   
    newVal =  randomChar();
    setVal(newVal);
    setTurn("user");
    setFirstTurn(false);
    setTime(59);
    setShowTimer(true);
    setShowButton(false)
    setMsg("");
    
  }
  useEffect(() => {
    let newVal;
    
    
    
    
    if (!firstTurn && turn === "computer") {
      const wordFinder = new Promise((resolve, reject) => {
        const url = "https://api.datamuse.com/words?sp=" + val + "*";
        console.log(val, url);
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log("error", err);
            reject(err);
          });
      });

      wordFinder.then((response) => {
        if (response.length > 1) {
          const randomIndex = Math.floor(Math.random() * response.length);
          const word = response[randomIndex].word;
          console.log(word);
          newVal = val + word[val.length];
          setVal(newVal.toUpperCase());
          setTime(59);
          setShowTimer(true);
          setTurn("user");
          document.querySelector("input").focus();
        } else if (response.length === 0) {
          setMsg("You Lost");
        } else if (response.length === 1) {
          setVal(response[0].word.toUpperCase());
          setMsg("You Win");
        }
      });
      wordFinder.catch((err) => {
        console.log(err);
      });
    }
  }, [turn]);

  useEffect(() => {
    if (time > 0 && turn === "user") {
      const interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    } else if (time === 0) {
      setMsg("You Lost");
    }
  });

  const userInput = (event) => {
    if (turn === "user" && time > 0) {
      const newVal = event.target.value;
      setVal(newVal.toUpperCase());
      setTurn("computer");
      setShowTimer(false);
    }
  };

  return (
    <div className="App">
      {showbutton ? <button className="button" onClick={startGame}>Start Game</button>:<>{msg === ""?<>
       <div className="row">
        <div className="col-md-5 imageouter ">
          <img
            className="image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEjZKw_zpeelObcZ02qWogm10Sl1pYfgrRSg&usqp=CAU"
            alt="computer"
          />
        </div>
        <div className="col-md-5 imageouter">
          <img
            className="image"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1OzagelduOqZsuVoyAYQcGI-sHhwK7dIxVA&usqp=CAU"
            alt="computer"
          />
        </div>
       
      
       <div className="col-md-1 left">
         <p style={{ visibility: showTimer ? "visible" : "hidden" }}>
           00 : {time}
         </p>
       </div>
      
     

       <div className="col-md-3 right">
         <input
           type="text"
           className="input"
           value={val}
           onChange={userInput}
           disabled={turn === "computer"}
         />
         <br />
        
       </div>
     </div>
     </>

      :
      <><div className="row1"><p className="p">{val}</p> <p className="p">{msg}</p> <button onClick={startGame} className="btn3">Play Again</button></div></>}</>}
     
    </div>
  );
}
