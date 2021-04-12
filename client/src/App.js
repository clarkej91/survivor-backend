import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import io from "socket.io-client";

const URL = "http://localhost:5000";
const socket = io.connect(URL, { transport : ['websocket'] });

class App extends Component {
  constructor( props ) {
  super( props );
    this.state = {
      response: [],
      tribe1: [],
      tribe2: [],
      tribe3: [],
      none: [],
      jury: [],
      value: [],
      name: "",
      playerResponse: [],
      tribeRespone: [],
      tribe1Challenge: [],
      tribe2Challenge: [],
      tribe3Challenge: [],
      showResults: false
    };
    this.getData = this.getData.bind(this)
    this.getPlayer = this.getPlayer.bind(this)
    this.updateTribe = this.updateTribe.bind(this)
    this.addLikeness = this.addLikeness.bind(this)
    this.subtractLikeness = this.subtractLikeness.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.diceRoll = this.diceRoll.bind(this);
    this.diceRollTie = this.diceRollTie.bind(this);
    this.eventRoll = this.eventRoll.bind(this);
    this.challengeRoll = this.challengeRoll.bind(this);
    this.addStrength = this.addStrength.bind(this);
    this.subtractStrength = this.subtractStrength.bind(this);
    this.addWit = this.addWit.bind(this);
    this.subtractWit = this.subtractWit.bind(this);
  }

  componentDidMount() {
    this.getData();
    // socket.on('FromAPI', data => {
    //   console.log('fromapi',data);
    // });
  }

  getData() {
    axios.get('http://localhost:5000').then((res) => {
      const response = res.data;
      // console.log(response)
      this.setState({response});
      socket.on("FromAPI", data => {
        console.log('hello world')
        const response = data;
        console.log(response)
        // this.setState({response});
      });
      // socket.on('FromAPI', data => {
      //   const response = data;
      //   console.log(response)
      //   this.setState({response});
      // });
    });
  }

  getPlayer(player) {
    axios.put('http://localhost:5000/getPlayer', {
        name: player
      })
      .then(response => {
        socket.on('FromgetPlayerAPI', data => {
          const playerResponse = data;
          this.setState({playerResponse});
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  addLikeness(id, likeness) {
    let num = likeness + 1
    axios.put('http://localhost:5000/updateCount', {
        id: id,
        likeness: num
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.getData();
  }

  subtractLikeness(id, likeness) {
    let num = likeness - 1
    axios.put('http://localhost:5000/updateCount', {
        id: id,
        likeness: num
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.getData();
  }

  addStrength(id, strength) {
    let num = strength + 1
    axios.put('http://localhost:5000/updateStrength', {
        id: id,
        strength: num
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.getData();
  }

  subtractStrength(id, strength) {
    let num = strength - 1
    axios.put('http://localhost:5000/updateStrength', {
        id: id,
        strength: num
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.getData();
  }

  addWit(id, wit) {
    let num = wit + 1
    axios.put('http://localhost:5000/updateWit', {
        id: id,
        wit: num
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.getData();
  }

  subtractWit(id, wit) {
    let num = wit - 1
    axios.put('http://localhost:5000/updateWit', {
        id: id,
        wit: num
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    this.getData();
  }

  updateTribe(event) {
    axios.put('http://localhost:5000/updateTribe', {
        id: [parseInt(this.state.value.split(',')[1])],
        tribe: this.state.value.split(',')[0]
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
      this.getData();
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  componentDidUpdate() {
  console.log('Test updated');
}

  diceRoll(tribe){
    let smallestValue = 0
    let lowestName = []
    for(let i = 0; i < tribe.length; i++){
      let diceRoll = tribe[i].likeness * 9
      let rollValue = Math.floor(Math.random() * diceRoll)
      if(tribe[i] === tribe[0]){
        smallestValue = rollValue
        lowestName = [tribe[i]]
      }
      else if(smallestValue > rollValue) {
        smallestValue = rollValue
        lowestName = [tribe[i]]
      }
      else if(smallestValue === rollValue) {
        smallestValue += rollValue
        lowestName.push(tribe[i])
      } else {

      }
      console.log(tribe[i].name, rollValue)
    }
    if(lowestName.length > 1){
      this.diceRollTie(lowestName)
    } else {
      this.getPlayer(lowestName[0].name);
    }
  }

  eventRoll(tribe) {
    let tribeMember = tribe[Math.floor(Math.random() * tribe.length)];
    this.getPlayer(tribeMember.name);
    this.setState({ showResults: false });
    // for(let i = 0; i < tribe.length; i ++){
    //   let d7RollValue = Math.floor(Math.random() * 7)
    // }
  }

  diceRollTie(lowestName) {
    console.log(lowestName, 'time to draw rocks')
    let playerArray = []
    for(let i = 0; i < lowestName.length; i ++){
      playerArray.push(lowestName[i].name)
    }
    this.setState({ showResults: true });
    this.getPlayer(playerArray);
  }

  challengeRoll(tribe1, tribe2, tribe3) {
    let tribes = [this.state.tribe1Challenge, this.state.tribe2Challenge, this.state.tribe3Challenge]
    let tribe1Roll = 0
    let tribe2Roll = 0
    let tribe3Roll = 0
    for(let i = 0; i < tribes.length; i ++){
      if(tribes[i].length === 0){
        continue;
      }
      let tribeArray = tribes[i]
        for(let j = 0; j < tribeArray.length; j ++){
          if(tribeArray[j].tribe === 'tribe1'){
          let rollValue = Math.floor(Math.random() * tribeArray[j].strength + tribeArray[j].wit)
          tribe1Roll = tribe1Roll + rollValue
        } else if(tribeArray[j].tribe === 'tribe2'){
          let rollValue = Math.floor(Math.random() * tribeArray[j].strength + tribeArray[j].wit)
          tribe2Roll = tribe2Roll + rollValue
        } else {
          let rollValue = Math.floor(Math.random() * tribeArray[j].strength + tribeArray[j].wit)
          tribe3Roll = tribe3Roll + rollValue
        }
      }
    }
    let rollValueArray = [tribe1Roll,tribe2Roll,tribe3Roll]
    let smallestValue = 0
    let lowestName = []
    for(let i = 0; i < rollValueArray.length; i ++){
      if(rollValueArray[i] === 0){
        continue;
      }
      else if(rollValueArray[i] === rollValueArray[0]){
        smallestValue = rollValueArray[i]
        lowestName = [tribes[i]]
      }
      else if(smallestValue > rollValueArray[i]) {
        smallestValue = rollValueArray[i]
        lowestName = [tribes[i]]
      }
      else if(smallestValue === rollValueArray[i]) {
        smallestValue += rollValueArray[i]
        lowestName.push(tribes[i])
      } else {

      }
    }
    console.log(lowestName)
    this.setState({ tribeRespone: [lowestName[0][0]] });
    console.log(tribe1Roll, tribe2Roll, tribe3Roll)
  }

  handleInputChange(data, event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    console.log(value);
    if(data.tribe === 'tribe1'){
      if(value === true){
        this.setState({ tribe1Challenge: [...this.state.tribe1Challenge, data] }, () => {
        })
      } else {
        let array = [...this.state.tribe1Challenge]
        let index = array.indexOf(data)
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({tribe1Challenge: array});
        }
      }
    } else if (data.tribe === 'tribe2'){
      if(value === true){
        this.setState({ tribe2Challenge: [...this.state.tribe2Challenge, data] }, () => {
        })
      } else {
        let array = [...this.state.tribe2Challenge]
        let index = array.indexOf(data)
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({tribe2Challenge: array});
        }
      }
    } else {
      if(value === true){
        this.setState({ tribe3Challenge: [...this.state.tribe3Challenge, data] }, () => {
        })
      } else {
        let array = [...this.state.tribe3Challenge]
        let index = array.indexOf(data)
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({tribe3Challenge: array});
        }
      }
    }
  }

  render() {
    let tribe1 = []
    let tribe2 = []
    let tribe3 = []
    let none = []
    let jury = []

    const tribeSort = this.state.response.map((data, i) => {
        if(data.tribe === 'jury'){
          jury.push(data)
        }
        else if(data.tribe === "tribe1"){
          tribe1.push(data)
        }
        else if(data.tribe === "tribe2"){
          tribe2.push(data)
        }
        else if(data.tribe === "tribe3"){
          tribe3.push(data)
        }
        else {
          none.push(data)
        }
    })
    const tribe1Array = tribe1.map((data, i) => {
      let tribe1Selected = []
      return(
        <tr key={data.id}>
          <td>
          <input
            name="isGoing"
            type="checkbox"
            onChange={ (event) => {this.handleInputChange(data, event)}}
             />
          </td>
          <td>{data.name}</td>
          <td>
          <form onSubmit={this.updateTribe}>
          <select
            defaultValue={[data.tribe, data.id]} onChange={this.handleChange}>
          <option value={['tribe1', data.id]}>Tribe1</option>
          <option value={['tribe2', data.id]}>Tribe2</option>
          <option value={['tribe3', data.id]}>Tribe3</option>
          <option value={['none', data.id]}>Voted out</option>
          <option value={['jury', data.id]}>Jury</option>
          </select>
          <input type="submit" value="Submit" />
          </form>
          </td>
          <td>{data.likeness}
          <div>
            <button onClick={() => this.addLikeness(data.id, data.likeness)}>+</button>
            <button onClick={() => this.subtractLikeness(data.id, data.likeness)}>-</button>
          </div>
          </td>
          <td>{data.strength}
          <div>
            <button onClick={() => this.addStrength(data.id, data.strength)}>+</button>
            <button onClick={() => this.subtractStrength(data.id, data.strength)}>-</button>
          </div>
          </td>
          <td>{data.wit}
          <div>
            <button onClick={() => this.addWit(data.id, data.wit)}>+</button>
            <button onClick={() => this.subtractWit(data.id, data.wit)}>-</button>
          </div>
          </td>
        </tr>
      )
    })
    const tribe2Array = tribe2.map((data, i) => {
      return(
        <tr key={data.id}>
          <td>
          <input
            name="isGoing"
            type="checkbox"
            onChange={ (event) => {this.handleInputChange(data, event)}}
             />
          </td>
          <td>{data.name}</td>
          <td>
          <form onSubmit={this.updateTribe}>
          <select
            defaultValue={[data.tribe, data.id]} onChange={this.handleChange}>
          <option value={['tribe1', data.id]}>Tribe1</option>
          <option value={['tribe2', data.id]}>Tribe2</option>
          <option value={['tribe3', data.id]}>Tribe3</option>
          <option value={['none', data.id]}>Voted out</option>
          <option value={['jury', data.id]}>Jury</option>
          </select>
          <input type="submit" value="Submit" />
          </form>
          </td>
          <td>{data.likeness}
          <div>
            <button onClick={() => this.addLikeness(data.id, data.likeness)}>+</button>
            <button onClick={() => this.subtractLikeness(data.id, data.likeness)}>-</button>
          </div>
          </td>
          <td>{data.strength}
          <div>
            <button onClick={() => this.addStrength(data.id, data.strength)}>+</button>
            <button onClick={() => this.subtractStrength(data.id, data.strength)}>-</button>
          </div>
          </td>
          <td>{data.wit}
          <div>
            <button onClick={() => this.addWit(data.id, data.wit)}>+</button>
            <button onClick={() => this.subtractWit(data.id, data.wit)}>-</button>
          </div>
          </td>
        </tr>
      )
    })
    const tribe3Array = tribe3.map((data, i) => {
      return(
        <tr key={data.id}>
          <td>
          <input
            name="isGoing"
            type="checkbox"
            onChange={ (event) => {this.handleInputChange(data, event)}}
             />
          </td>
          <td>{data.name}</td>
          <td>
          <form onSubmit={this.updateTribe}>
          <select
            defaultValue={[data.tribe, data.id]} onChange={this.handleChange}>
          <option value={['tribe1', data.id]}>Tribe1</option>
          <option value={['tribe2', data.id]}>Tribe2</option>
          <option value={['tribe3', data.id]}>Tribe3</option>
          <option value={['none', data.id]}>Voted out</option>
          <option value={['jury', data.id]}>Jury</option>
          </select>
          <input type="submit" value="Submit" />
          </form>
          </td>
          <td>{data.likeness}
            <div>
              <button onClick={() => this.addLikeness(data.id, data.likeness)}>+</button>
              <button onClick={() => this.subtractLikeness(data.id, data.likeness)}>-</button>
            </div>
          </td>
          <td>{data.strength}
          <div>
            <button onClick={() => this.addStrength(data.id, data.strength)}>+</button>
            <button onClick={() => this.subtractStrength(data.id, data.strength)}>-</button>
          </div>
          </td>
          <td>{data.wit}
          <div>
            <button onClick={() => this.addWit(data.id, data.wit)}>+</button>
            <button onClick={() => this.subtractWit(data.id, data.wit)}>-</button>
          </div>
          </td>
        </tr>
      )
    })
    const noneArray = none.map((data, i) => {
      return(
        <tr key={data.id}>
        <td>
        <input
          name="isGoing"
          type="checkbox"
          onChange={ (event) => {this.handleInputChange(data, event)}}
           />
        </td>
          <td>{data.name}</td>
          <td>
          <form onSubmit={this.updateTribe}>
          <select
            defaultValue={[data.tribe, data.id]} onChange={this.handleChange}>
          <option value={['tribe1', data.id]}>Tribe1</option>
          <option value={['tribe2', data.id]}>Tribe2</option>
          <option value={['tribe3', data.id]}>Tribe3</option>
          <option value={['none', data.id]}>Voted out</option>
          <option value={['jury', data.id]}>Jury</option>
          </select>
          <input type="submit" value="Submit" />
          </form>
          </td>
          <td>{data.likeness}
          <div>
            <button onClick={() => this.addLikeness(data.id, data.likeness)}>+</button>
            <button onClick={() => this.subtractLikeness(data.id, data.likeness)}>-</button>
          </div>
          </td>
          <td>{data.strength}
          <div>
            <button onClick={() => this.addStrength(data.id, data.strength)}>+</button>
            <button onClick={() => this.subtractStrength(data.id, data.strength)}>-</button>
          </div>
          </td>
          <td>{data.wit}
          <div>
            <button onClick={() => this.addWit(data.id, data.wit)}>+</button>
            <button onClick={() => this.subtractWit(data.id, data.wit)}>-</button>
          </div>
          </td>
        </tr>
      )
    })
    const juryArray = jury.map((data, i) => {
      return(
        <tr key={data.id}>
          <td>{data.name}</td>
          <td>
          <form onSubmit={this.updateTribe}>
          <select
            defaultValue={[data.tribe, data.id]} onChange={this.handleChange}>
          <option value={['tribe1', data.id]}>Tribe1</option>
          <option value={['tribe2', data.id]}>Tribe2</option>
          <option value={['tribe3', data.id]}>Tribe3</option>
          <option value={['none', data.id]}>Voted out</option>
          <option value={['jury', data.id]}>Jury</option>
          </select>
          <input type="submit" value="Submit" />
          </form>
          </td>
          <td>{data.likeness}</td>
          <div>
            <button onClick={() => this.addLikeness(data.id, data.likeness)}>+</button>
            <button onClick={() => this.subtractLikeness(data.id, data.likeness)}>-</button>
          </div>
        </tr>
      )
    })
    const playerEvent = this.state.playerResponse.map((data, i) => {
      console.log(data.name)
      return(
        <div key={data.id}>
        {data.name}
        </div>
      )
    })
    const tribeEvent = this.state.tribeRespone.map((data, i) => {
      return(
        <div key={data.id}>
        {data.tribe}
        </div>
      )
    })
    return (
      <div className="App">
      <h2>
      Event Happeneds to: {playerEvent}{tribeEvent}
      { this.state.showResults ? <div>
        <button onClick={() => this.eventRoll(this.state.playerResponse)}>Draw Rocks</button>
      </div> : null }
      </h2>
          <button onClick={() => this.challengeRoll(tribe1, tribe2, tribe3)}>Challenge Roll</button>
        <h2>Tribe 1</h2>
        <table>
          <thead>
          <tr>
            <th>
            []
            </th>
            <th>
            Name
            </th>
            <th>
            Tribe
            </th>
            <th>
            Likeness
            </th>
            <th>
            Strength
            </th>
            <th>
            Wit
            </th>
          </tr>
          </thead>
          <tbody>
          {tribe1Array}
          </tbody>
        </table>
        <div>
          <button onClick={() => this.diceRoll(tribe1)}>Tribal Roll</button>
          <button onClick={() => this.eventRoll(tribe1)}>Event Roll</button>
        </div>
        <h2>Tribe 2</h2>
        <table>
          <thead>
          <tr>
            <th>
            []
            </th>
            <th>
            Name
            </th>
            <th>
            Tribe
            </th>
            <th>
            Likeness
            </th>
            <th>
            Strength
            </th>
            <th>
            Wit
            </th>
          </tr>
          </thead>
          <tbody>
          {tribe2Array}
          </tbody>
        </table>
        <div>
          <button onClick={() => this.diceRoll(tribe2)}>Tribal Roll</button>
          <button onClick={() => this.eventRoll(tribe2)}>Event Roll</button>
        </div>
        <h2>Tribe 3</h2>
        <table>
          <thead>
          <tr>
            <th>
            []
            </th>
            <th>
            Name
            </th>
            <th>
            Tribe
            </th>
            <th>
            Likeness
            </th>
            <th>
            Strength
            </th>
            <th>
            Wit
            </th>
          </tr>
          </thead>
          <tbody>
          {tribe3Array}
          </tbody>
        </table>
        <div>
          <button onClick={() => this.diceRoll(tribe3)}>Tribal Roll</button>
          <button onClick={() => this.eventRoll(tribe3)}>Event Roll</button>
        </div>
        <h2>Voted out</h2>
        <table>
          <thead>
          <tr>
            <th>
            []
            </th>
            <th>
            Name
            </th>
            <th>
            Tribe
            </th>
            <th>
            Likeness
            </th>
            <th>
            Strength
            </th>
            <th>
            Wit
            </th>
          </tr>
          </thead>
          <tbody>
          {noneArray}
          </tbody>
        </table>
        <div>
          <button onClick={() => this.diceRoll(none)}>Tribal Roll</button>
          <button onClick={() => this.eventRoll(none)}>Event Roll</button>
        </div>
        <h2>Jury</h2>
        <table>
          <thead>
          <tr>
            <th>
            Name
            </th>
            <th>
            Tribe
            </th>
            <th>
            Likeness
            </th>
          </tr>
          </thead>
          <tbody>
          {juryArray}
          </tbody>
        </table>
        <div>
          <button onClick={() => this.diceRoll(jury)}>Tribal Roll</button>
          <button onClick={() => this.eventRoll(jury)}>Event Roll</button>
        </div>
      </div>
    );
  }
}

export default App;
