import React from 'react';

const InputForm = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [reps, setReps] = React.useState(10000);
  const [odds, setOdds] = React.useState(0.0001);

  const calcRng = () => {
      let count = 1;
      while (Math.random() > odds) {
        count++
      };
      return count;
  }

  const transformChartData = data => {
    const maxValue = Math.max(...data);

    const valStr = maxValue.toString();

    const lowerBound = 0; // TODO: update code to account for this being different
    const upperBound = parseInt( `${+valStr[0] + 1}${'0'.repeat( valStr.length - 1 )}`);

    // make sure this divides evenly
    //arrayLength = upperBound / props.chartData.divisions || 1;

    // 0-fill the array and create labels
    const chartData = [];
    const labels = [];
    const step = upperBound / props.chartData.divisions;

    for (let i = 0 ; i < props.chartData.divisions ; i++) {
      chartData[i] = [];
      labels.push(`${i * step} - ${(i + 1) * step - 1}`);
    }

    // Count data
    data.forEach(value => {
      const arrayIndex = Math.floor(value / upperBound * props.chartData.divisions);
      chartData[arrayIndex].push(value);
    });

    return {
      labels: labels,
      datasets: [{
        label: 'RNG data frequency',
        backgroundColor: 'rgb(132, 99, 255)',
        borderColor: 'rgb(132, 99, 255)',
        data: chartData.map(value => value.length),
      }],
      divisions: props.chartData.divisions,
      options: {
        scales: {
          xAxes: {
            gridLines: {
              offsetGridLines: false
            }
          }
        }
      }
    }
  };

  const findBestOf = (f, iterations) => {
    let max = 0;
    let results = [];

    for (let i = 0 ; i < iterations ; i++) {
        const result = f();
        results.push(result);
        max = max < result ? result : max;
    }

    results.sort((a, b) => a - b)

    return {
      max: max,
      count: results.length,
      average: results.reduce((acc, a) => acc + a, 0) / results.length,
      chartData: results
    };
  }

  React.useEffect(() => {
    const calculate = () => {
      const result = findBestOf(calcRng, reps);
      console.log('result:', result)
      props.setChartData(transformChartData(result.chartData));
      // This is the only data the parent needs to know about that the chart doesn't
      props.setMaxValue(result.max);
      setIsLoading(false);
    };

    if (isLoading) {
      // Calculate update the state and causes it's own re-render so defer this
      setTimeout(calculate, 0);
    }
  }, [isLoading]);

  const handleClick = () => {
    setIsLoading(true);
  }

  return (
    <div className="input-form">
        <div>
            <label>
              Number of repititions:
            </label>
            <input
              type="number"
              max="1000000"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
            />
        </div>
        <div>
            <label>
              Odds:
            </label>
            <input
              type="number"
              max="1"
              precision="0.0001"
              step="0.0001"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
            />
        </div>
        <div>
          <input
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            value={isLoading ? "Loading..." : "Calculate"}
          />
        </div>
    </div>
  );
}

export default InputForm;