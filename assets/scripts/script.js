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
  
    try {
      const response = await fetch(API_LINK, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
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
            <img src="assets/img/more_horiz_FILL0_wght300_GRAD0_opsz24.png" alt="" />
          </div>`;
      });
  
      const chosenData = data.filter((item, index) => index === selectedIndex);
      sendProfiletoDom(chosenData[0]); // Pass selected profile data to DOM
      getUserStats(data, selectedIndex); // Pass full data for chart handling
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      spinner.forEach((item) => {
        item.classList.add('hideloader');
      });
    }
  }
  
  fetchData(selected);
  
  function sendProfiletoDom(profile) {
    const image = document.getElementById('profile_image');
    const name = document.getElementById('profile_name');
  
    image.src = profile.profile_picture;
    name.textContent = profile.name;
  
    const profileData = [
      { field: 'Date of Birth', icon: 'assets/img/BirthIcon.svg', value: profile.date_of_birth },
      { field: 'Gender', icon: 'assets/img/FemaleIcon.svg', value: profile.gender },
      { field: 'Contact Info', icon: 'assets/img/PhoneIcon.svg', value: profile.phone_number },
      { field: 'Emergency Contact', icon: 'assets/img/PhoneIcon.svg', value: profile.emergency_contact },
      { field: 'Insurance Provider', icon: 'assets/img/InsuranceIcon.svg', value: profile.insurance_type },
    ];
  
    const profileSection = document.getElementById('profile_section');
    profileSection.innerHTML = ''; // Clear previous content
    profileData.forEach((item) => {
      profileSection.innerHTML += `
        <div class='profile-box'>
          <img src='${item.icon}' alt='' />
          <span>
            <p>${item.field}</p>
            <p>${item.value}</p>
          </span>
        </div>`;
    });
  }
  
  function getUserStats(data, id) {
    const ctx = document.getElementById('myChart');
    ctx.width = 200;
  
    const result = data.filter((item, index) => index === id);
    const diagnosis = result[0].diagnosis_history.reverse(); // Reverse the diagnosis history
  
    sendchartInfoToDom(diagnosis[diagnosis.length - 1]); // Send the latest diagnosis info to the DOM
  
    const lastSix = diagnosis.slice(-6); // Get the last six diagnosis entries
  
    const bloodpress1 = lastSix.map((item) => item.blood_pressure.diastolic.value);
    const bloodpress2 = lastSix.map((item) => item.blood_pressure.systolic.value);
  
    console.log(bloodpress1, bloodpress2);
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: lastSix.map((item) => `${item.month.substring(0, 3)} ${item.year}`),
        datasets: [
          {
            label: 'Systolic Pressure',
            data: bloodpress2,
            borderWidth: 1,
            borderColor: '#E66FD2',
            backgroundColor: '#E66FD2',
            pointHitRadius: 32,
            pointRadius: 5,
            tension: 0.4,
          },
          {
            label: 'Diastolic Pressure',
            data: bloodpress1,
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
            display: false,
          },
        },
      },
    });
  }
  
  function sendchartInfoToDom(last_diagnosis) {
    document.getElementById('systolic_value').innerHTML = last_diagnosis.blood_pressure.systolic.value;
    document.getElementById('systolic_image').innerHTML = displayLevelSign(last_diagnosis.blood_pressure.systolic.levels);
    document.getElementById('systolic_level').innerHTML = last_diagnosis.blood_pressure.systolic.levels;
  
    document.getElementById('distolic_value').innerHTML = last_diagnosis.blood_pressure.diastolic.value;
    document.getElementById('distolic_image').innerHTML = displayLevelSign(last_diagnosis.blood_pressure.diastolic.levels);
    document.getElementById('distolic_level').innerHTML = last_diagnosis.blood_pressure.diastolic.levels;
  
    const diagnosisInfo = [
      { field: 'Resporatory Rate', value: last_diagnosis.respiratory_rate.value, level: last_diagnosis.respiratory_rate.levels, color: '#e0f3fa', image: 'assets/img/HeartBPM (1).svg' },
      { field: 'Temperature', value: last_diagnosis.temperature.value, level: last_diagnosis.temperature.levels, color: '#ffe6e9', image: 'assets/img/temperature (1).svg' },
      { field: 'Heart Rate', value: last_diagnosis.heart_rate.value, level: last_diagnosis.heart_rate.levels, color: '#ffe6f1', image: 'assets/img/HeartBPM (1).svg' },
    ];
  
    const infoSection = document.getElementById('info-sec');
    infoSection.innerHTML = ''; // Clear previous content
    diagnosisInfo.forEach((item) => {
      infoSection.innerHTML += `
        <div class="box" style="background-color: ${item.color}">
          <img src='${item.image}' alt="" />
          <p>${item.field}</p>
          <h3>${item.value} ${item.field === 'Temperature' ? '°F' : 'bpm'}</h3>
          <small>${displayLevelSign(item.level)} ${item.level}</small>
        </div>`;
    });
  }
  
  function displayLevelSign(level) {
    if (level === 'Lower than Average') {
      return '<img src="assets/img/ArrowDown.svg">';
    } else if (level === 'Higher than Average') {
      return '<img src="assets/img/ArrowUp.svg">';
    } else {
      return '';
    }
  }
  
  // export default getUserStats;
  