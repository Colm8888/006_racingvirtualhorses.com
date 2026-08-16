// Step Two Data Values & Loader
function loadStep2SampleData() {
    document.getElementById('input_1a').value = '6.51.79';
    document.getElementById('going_1').value = '40';
    document.getElementById('input_2a').value = '6.51.89';
    document.getElementById('going_2').value = '70';
    document.getElementById('input_3a').value = '6.50.59';
    document.getElementById('going_3').value = '50';
    document.getElementById('input_4a').value = '6.50.64';
    document.getElementById('going_4').value = '20';
    console.log('Calculator 01 test data loaded!');
}

// Step Three Data Values & Loader
function loadStep3SampleData() {
    document.getElementById('s2_input_1a').value = '3.33.22';
    document.getElementById('s2_input_2a').value = '3.33.58';
    document.getElementById('s2_input_3a').value = '3.32.20';
    document.getElementById('s2_input_4a').value = '3.32.42';
    console.log('Calculator 02 test data loaded!');
}

// Step Four Data Values & Loader
function loadStep4SampleData() {
    document.getElementById('s3_input_1').value = '6.48.53';
    document.getElementById('s3_input_2').value = '6.48.39';
    document.getElementById('s3_input_3').value = '6.48.57';
    document.getElementById('s3_input_4').value = '6.49.03';

    document.getElementById('s3_input_5').value = '6.49.21';
    document.getElementById('s3_input_6').value = '6.49.38';
    document.getElementById('s3_input_7').value = '6.49.16';
    document.getElementById('s3_input_8').value = '';

    document.getElementById('s3_input_9').value = '6.48.31';
    document.getElementById('s3_input_10').value = '6.48.10';
    document.getElementById('s3_input_11').value = '6.48.70';
    document.getElementById('s3_input_12').value = '';

    document.getElementById('s3_input_13').value = '6.48.88';
    document.getElementById('s3_input_14').value = '6.49.20';
    document.getElementById('s3_input_15').value = '6.48.60';
    document.getElementById('s3_input_16').value = '';

    console.log('Calculator 03 test data loaded!');
}

// Keyboard Shortcuts Listener
document.addEventListener('keydown', function (event) {
    // Shortcut for Calculator 01: Ctrl + Shift + D
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        loadStep1And2Data();
    }

    // Shortcut for Calculator 02: Ctrl + Shift + E
    if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        loadStep2SampleData();
    }

    // Shortcut for Calculator 03 (Step Four): Ctrl + Shift + R
    if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        event.preventDefault();
        loadStep4SampleData();
    }
});
