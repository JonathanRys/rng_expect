import React from 'react';
import logo from './logo.svg';
import './App.css';
import InputForm from './InputForm';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

function App() {
  const chartRef = React.useRef(null);
  const [labels, setLabels] = React.useState(["0", "5000", "10000"]);
  const [maxValue, setMaxValue] = React.useState(0);
  const [chartData, setChartData] = React.useState({
    labels: labels,
    datasets: [],
    divisions: 10
  });

  React.useEffect(() => {
    const chart = chartRef.current;

    if (chart) {
      chart.update();
    }
  }, [chartData]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '# of results for range'
        }
      },
      x: {
        beginAtZero: true,
        position: 'right',
        gridLines: {
          offsetGridLines: true
        },
        title: {
          display: true,
          text: 'Number of tries'
        }
      }
    },
  };

  return (
    <div className="App">
      <header className="App-header">
          Find RNG Expectations
      </header>
      <InputForm
        chartData={chartData}
        setChartData={setChartData}
        setMaxValue={setMaxValue}
      />
      <div className="chart-container">
        <Chart type='bar' data={chartData} options={options} />
      </div>
      <footer className="App-footer">
        <div>{maxValue ? `Most number of tries: ${maxValue}` : ''}</div>
      </footer>
    </div>
  );
}

export default App;
