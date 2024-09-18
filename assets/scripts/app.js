// import getUserStats from './chart.js';



document.getElementById('menu-icon').addEventListener('click', () => {
  const navList = document.querySelector('.rest-nav');
  navList.classList.toggle('hide');
});

const selected = 3;

const username = 'coalition';
const password = 'skills-test';
const auth = window.btoa(`${username}:${password}`);
const API_LINK = `https://fedskillstest.coalitiontechnologies.workers.dev`;
const spinner = document.querySelectorAll('.loaderparent');

console.log(spinner);

async function fetchData(selectedIndex) {
  const spinner = document.querySelectorAll('.loaderparent');

  console.log(spinner);
  spinner.forEach((item) => {
    item.classList.remove('hideloader');
  });

  console.log(spinner);

  try {
    const response = await fetch(API_LINK, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    sessionStorage.setItem('charts', JSON.stringify(data));
    console.log(data);

    const bottomDiv = document.querySelector('.bottom');
    bottomDiv.innerHTML = ''; // Clear previous content if any
    data.forEach((element) => {
      bottomDiv.innerHTML += `
        <div class="inner-patient">
          <div class="inner">
            <img src="${element.profile_picture}" width="40" height="40" alt="" />
            <span>
              <small><b>${element.name}</b></small>
              <small>${element.gender}, ${element.age}</small>
            </span>
          </div>
          <img src="assets/more_horiz_FILL0_wght300_GRAD0_opsz24.png" alt="" />
        </div>`;
    });

    let chosenData = data.filter((item, index) => {
      return index == selectedIndex;
    });
    // getUserStats(selectedIndex);

    sendProfiletoDom(chosenData[0]);
  } catch (error) {
    console.error('Fetch error:', error);
  } finally {
    spinner.forEach((item) => {
      item.classList.add('hideloader');
      console.log(item);
    });
    console.log(spinner);
  }
}

fetchData(selected);

function sendProfiletoDom(profile) {
  let image = document.getElementById('profile_image');
  let name = document.getElementById('profile_name');

  image.src = profile.profile_picture;
  name = profile.name;

  [
    {
      field: 'Date of Birth',
      icon: 'assets/BirthIcon.svg',
      value: profile.date_of_birth,
    },
    { field: 'Gender', icon: 'assets/FemaleIcon.svg', value: profile.gender },
    {
      field: 'Contact Info',
      icon: 'assets/PhoneIcon.svg',
      value: profile.phone_number,
    },
    {
      field: 'Emergency Contact',
      icon: 'assets/PhoneIcon.svg',
      value: profile.emergency_contact,
    },
    {
      field: 'Insurance Provider',
      icon: 'assets/InsuranceIcon.svg',
      value: profile.insurance_type,
    },
  ].forEach((item) => {
    document.getElementById(
      'profile_section'
    ).innerHTML += `<div class='profile-box'>
        <img src='${item.icon}' alt='' />
        <span>
          <p>${item.field}</p>
          <p>${item.value}</p>
        </span>
      </div>`;
  });
}
console.log(JSON.parse(sessionStorage.getItem('charts')));


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
