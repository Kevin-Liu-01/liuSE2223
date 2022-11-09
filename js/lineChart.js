//Graph CSV data using chart.js

//Parse csv data
async function getData() {
  const response = await fetch("../data/research-data.csv");
  const data = await response.text(); //CSV in TEXT format

  const xDays = []; //x-axis labels
  const yPop1 = []; //y-axis labels
  const yPop2 = []; //y-axis labels
  const yPop3 = []; //y-axis labels
  const yPop4 = []; //y-axis labels
  const yPop5 = []; //y-axis labels
  const yPop6 = []; //y-axis labels
  const yPop7 = []; //y-axis labels

  const table = data.split("\n").slice(1); //split by line and remove zero index
  //   console.log(table);

  table.forEach((col) => {
    //operate on each row
    const columns = col.split(","); //split each row by comma

    const days = columns[0]; //assign year values
    xDays.push(days); //push year value into array as years

    const population1 = parseFloat(columns[1]); //global temp deviations
    yPop1.push(population1 + 14); //push temp value into array as temps

    const population2 = parseFloat(columns[2]); //global temp deviations
    yPop2.push(population2 + 14); //push temp value into array as temps

    const population3 = parseFloat(columns[3]); //global temp deviations
    yPop3.push(population3 + 14); //push temp value into array as temps

    const population4 = parseFloat(columns[4]); //global temp deviations
    yPop4.push(population4 + 14); //push temp value into array as temps

    const population5 = parseFloat(columns[5]); //global temp deviations
    yPop5.push(population5 + 14); //push temp value into array as temps

    const population6 = parseFloat(columns[6]); //global temp deviations
    yPop6.push(population6 + 14); //push temp value into array as temps

    const population7 = parseFloat(columns[7]); //global temp deviations
    yPop7.push(population7 + 14); //push temp value into array as temps
  });

  return [xDays, yPop1, yPop2, yPop3, yPop4, yPop5, yPop6, yPop7];
}

async function createChart() {
  const data = await getData(); //createChart() will wait until getData() processes
  // Configured for chart.JS 3.x and above

  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data[0],
      datasets: [
        {
          label: "Control (No treatment)",
          data: data[1],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
        {
          label: "Ethanol Control (Ethanol treatment)",
          data: data[2],
          backgroundColor: "rgba(54, 162, 235, 0.2)",

          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "0.1% Marker Fluid",
          data: data[3],
          backgroundColor: "rgba(255, 206, 86, 0.2)",

          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "1% Marker Fluid",
          data: data[4],
          backgroundColor: "rgba(75, 192, 192, 0.2)",

          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "10% Marker Fluid",
          data: data[5],
          backgroundColor: "rgba(255, 159, 64, 0.2)",

          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 1,
        },
        {
          label: "100% Marker Fluid",
          data: data[6],
          backgroundColor: "rgba(70, 235, 50, 0.2)",

          borderColor: "rgba(70, 235, 50, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true, // Re-size based on screen size
      scales: {
        // x & y axes display options
        x: {
          title: {
            display: true,
            text: "Days Passed",
            font: {
              size: 20,
            },
          },
          //ticks
          // ticks: {
          //   callback: function (val, index) {
          //     return index % 5 === 0 ? this.getLabelForValue(val) : "";
          //   },
          //   font: {
          //     size: 8,
          //   },
          // },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Populations of C. Elegans",
            font: {
              size: 20,
            },
          },
          // ticks: {
          //   maxTicksLimit: data[1].length / 2,
          // },
        },
      },
      plugins: {
        // title and legend display options
        title: {
          display: true,
          text: "Raw Data Table of Various C. elegans Populations Exposed to Marker Fluid Over Time",
          font: {
            size: 24,
          },
          padding: {
            top: 10,
            bottom: 30,
          },
        },
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

createChart();
