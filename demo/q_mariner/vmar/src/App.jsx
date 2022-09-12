import { useState } from 'react'
import logo from './logo.svg'
import unit from './CHAR_MARINER.png'
import './App.css'



function App() {

  const [size, setSize] = useState(400)
  const [count, setCount] = useState(1)

  function handleSizeChange(event) {
    // this.setState({value: event.target.value});
    setSize(event.target.value);
  }
  function handleCountChange(event) {
    // this.setState({value: event.target.value});
    setCount(event.target.value);
  }

  function numUnits(n) {
    let content = [];
    for (var i = 0; i < n; i++) {
      content.push(<img src={unit} width={size} height={size} style={{ outline: "1px solid white"}}/>);
    }
    return content;
  }
  

  return (
    <div className="App">
      <header className="App-header">

        <div style={{width:"100%", height:"700px"}} >
            {numUnits(count)}  
        </div>
        

        <div style={{display: "flex", justifyContent: "space-between", padding: "10px"}}>

          <div style={{ flex: 1 }}>
            <p> {size} x {size} </p>
            <input id="typeinp" type="range" min="0" max="800" defaultValue="400" step="25" onChange={handleSizeChange}/>
          </div>

          <div style={{ flex: 1 }}>
            <p> {count} </p>
            <input id="typeinp" type="range" min="1" max="10" defaultValue="1" step="1" onChange={handleCountChange}/>
          </div>

        </div>

      </header>
    </div>
  )
}

export default App
