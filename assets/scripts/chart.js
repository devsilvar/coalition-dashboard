function getUserStats(id) {
  let my_data = JSON.parse(sessionStorage.getItem('charts'));
  const ctx = document.getElementById('myChart');
  ctx.width = 200;
  console.log(my_data);
  let result = my_data.filter((item, index, arr) => index == id);
  let diagnosis = result[0].diagnosis_history;

  // getUserLastDiagnosis(diagnosis);
  let reversedList = diagnosis.reverse();

  sendchartInfoToDOm(reversedList[reversedList.length - 1]);

  let lastSix = diagnosis.slice(-6);
  console.log(lastSix);

  let bloodpress1 = lastSix.map((item) => item.blood_pressure.diastolic.value);

  let bloodpress2 = lastSix.map((item) => item.blood_pressure.systolic.value);

  console.log(bloodpress1);
  console.log(bloodpress2);
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        ...lastSix.map((item) => item.month.substring(0, 3) + ' ' + item.year),
      ],
      datasets: [
        {
          label: '# of Votes',
          data: [...bloodpress2],
          borderWidth: 1,
          borderColor: '#E66FD2',
          backgroundColor: '#E66FD2',
          pointHitRadius: 32,
          pointRadius: 5,
          tension: 0.4,
        },
        {
          label: '# of Votes',
          data: [...bloodpress1],
          borderWidth: 1,
          borderColor: '#7E6CAB',
          backgroundColor: '#7E6CAB',
          pointHitRadius: 32,
          pointRadius: 5,
          tension: 0.4,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          min: 60,
        },
      },
      plugins: {
        legend: {
          display: false, // Disable the legend
        },
      },
    },
  });
}

function sendchartInfoToDOm(last_diagnosis) {
  console.log(last_diagnosis);
  document.getElementById('systolic_value').innerHTML =
    last_diagnosis.blood_pressure.systolic.value;

  document.getElementById('systolic_image').innerHTML = displayLevelSign(
    last_diagnosis.blood_pressure.systolic.levels
  );

  document.getElementById('systolic_level').innerHTML =
    last_diagnosis.blood_pressure.systolic.levels;

  document.getElementById('distolic_value').innerHTML =
    last_diagnosis.blood_pressure.diastolic.value;

  document.getElementById('distolic_image').innerHTML = displayLevelSign(
    last_diagnosis.blood_pressure.diastolic.levels
  );

  document.getElementById('distolic_level').innerHTML =
    last_diagnosis.blood_pressure.diastolic.levels;
  [
    {
      field: 'Resporatory Rate',
      value: last_diagnosis.respiratory_rate.value,
      level: last_diagnosis.respiratory_rate.levels,
      color: '#e0f3fa',
      image: 'assets/HeartBPM (1).svg',
    },
    {
      field: 'Temperature',
      value: last_diagnosis.temperature.value,
      level: last_diagnosis.temperature.levels,
      color: '#ffe6e9',
      image: 'assets/temperature (1).svg',
    },
    {
      field: 'Heart Rate',
      value: last_diagnosis.heart_rate.value,
      level: last_diagnosis.heart_rate.levels,
      color: '#ffe6f1',
      image: 'assets/HeartBPM (1).svg',
    },
  ].forEach((item) => {
    document.getElementById('info-sec').innerHTML += `
      <div class="box" style="background-color: ${item.color}">
            <img src='${item.image}' alt="" />
            <p>${item.field}</p>
            <h3>${item.value}  ${
      item.field == 'Temperature' ? '°F' : 'bpm'
    } </h3>
            <small>${displayLevelSign(item.level)}   ${item.level}</small>
          </div>
    `;
  });
}
function displayLevelSign(level) {
  if (level == 'Lower than Average') {
    return '<img src="assets/ArrowDown.svg">';
  } else if (level == 'Higher than Average') {
    return '<img src="assets/ArrowUp.svg">';
  } else {
    return '';
  }
}

// export default getUserStats;

getUserStats(3);
