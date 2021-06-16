import React from 'react';


class App extends React.Component {
  // construtor com a inicialização das tasks
  constructor(props) {
    super(props);
    this.state = {
      weatherHistory: [],
      addInputText: '',
      statusMessage:'', 
    }

    this.timeoutInterval = null;
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleAddTaskText = this.handleAddTaskText.bind(this);
  }

  handleAddTask (e) {
    e.preventDefault();

    clearTimeout(this.timeoutInterval);
    
    this.setState({statusMessage: 'loading ...'});


    let appid = '01502025a2c137f27545b5d44b270a5b';
    let cityName = this.state.addInputText;
    fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&q=' + cityName + '&appid=' + appid)
      .then(response => response.json())
      .then(data => {
        
      console.log (data);
      if(data.cod === 200){
        let weatherHistoryCopy = this.state.weatherHistory.slice();
        // adicionar nova tarefa na cópia criada acima
        weatherHistoryCopy.push({
          name: this.state.addInputText,
          city: data.name,
          country: data.sys.country,
          temp_atual:data.main.temp,
          temp_min:data.main.temp_min,
          temp_max: data.main.temp_max,
          icon: data.weather[0].icon,
        });
        // colocar cópia como o novo estado a ser assumido pela aplicação
        this.setState({
          weatherHistory: weatherHistoryCopy,
          addInputText: '',
          statusMessage: '',
          });
        }
        else{
          this.setState({
            addInputText: '',
            statusMessage: 'ocorreu um problema (cod: '+ data.cod +')',
          });
          {/* fazer um timeout p fazer desaparecer a msg */}
          this.timeoutInterval = setTimeout( () => {
            this.setState({
              statusMessage:'',
          })
        }, 5000);
        }
      });
  
  }
  handleAddTaskText (e) {
    this.setState({
      addInputText: e.target.value,
    });
  }

  
  handleRemoveTask (taskIndex) {
    // recebe o taskIndex
    // faz cópia do tasks
    let weatherHistoryCopy = this.state.weatherHistory.slice();

    // remove a task
    weatherHistoryCopy.splice(taskIndex, 1);
    // tasksCopy = tasksCopy.filter((task, index) => index !== taskIndex);

    // reinjecta no state o tasksCopy como valor do tasks
    this.setState({
      weatherHistory: weatherHistoryCopy,
    });
  }

render () {
return (

  <section>
      <form onSubmit={this.handleAddTask}>
      <input type="text"
              value={this.state.addInputText}
              onChange={this.handleAddTaskText}/>
      <button type="submit">Pesquisar</button>
      <p>{this.state.statusMessage}</p>
      </form>

      <ul className="history">
      {
        this.state.weatherHistory.map((history, weatherHistoryIndex) => {
          return <li
            key={"history_" + weatherHistoryIndex}>
              pesquisa: {history.name} <br/>
              cidade: {history.city} <br/>
              país:{history.country} <br/>
              atual: {history.temp_atual} º<br/>
              miníma: {history.temp_min}º <br/>
              máxima: {history.temp_max}º <br/>
              <img src={"http://openweathermap.org/img/w/" + history.icon + ".png"}/>
              <button onClick={this.handleRemoveTask.bind(this, weatherHistoryIndex)}>
                Apagar
              </button>
              </li> 
      }
      )
      }
      </ul>
  
  </section>
);
}
}


export default App;
