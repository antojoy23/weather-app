import React from "react";
import $ from "jquery";
import { Line } from "react-chartjs-2";

const Graph = props => {
  let currentDay = props.data.currentDay;
  let tempList = [];
  let labelList = [];
  let maxTemp = 0;
  $.each(props.data.weatherDetails[currentDay], function(idx, weather) {
    let time = weather.time.split(" ");
    tempList.push(weather.temp);
    labelList.push(time[0].substr(0, 2) + " " + time[1]);
    maxTemp = weather.temp > maxTemp ? weather.temp : maxTemp;
  });
  let data = getDataForChart(tempList, labelList);
  let options = getOptions(maxTemp);
  return (
    <div className="wsection">
      <Line
        data={data}
        height={75}
        options={options}
        onElementsClick={element => props.onGraphClick(element)}
      />
    </div>
  );
};

function getDataForChart(tempList, labelList) {
  return {
    labels: labelList,
    datasets: [
      {
        data: tempList,
        fill: true,
        backgroundColor: "#f0f8ff",
        borderColor: "#a4d4ff",
        pointBorderColor: "#dd6200"
      }
    ]
  };
}

function getOptions(temp) {
  return {
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            display: false,
            suggestedMax: temp + 10,
            beginAtZero: true
          },
          gridLines: {
            drawBorder: false,
            display: false
          }
        }
      ]
    }
  };
}

export default Graph;
