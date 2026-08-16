function calculateVerification() {
    // Helper function to convert time string (M.SS.SS or similar) to total seconds
    function timeToSeconds(timeStr) {
        if (!timeStr) return null;
        timeStr = timeStr.trim().replace(/^[+-]/, '');
        let parts = timeStr.split('.');
        if (parts.length === 3) {
            let minutes = parseFloat(parts[0]) || 0;
            let seconds = parseFloat(parts[1]) || 0;
            let milliseconds = parseFloat(parts[2]) || 0;
            return minutes * 60 + seconds + milliseconds / 100;
        } else if (parts.length === 2) {
            let minutes = parseFloat(parts[0]) || 0;
            let seconds = parseFloat(parts[1]) || 0;
            return minutes * 60 + seconds;
        }
        return parseFloat(timeStr) || null;
    }

    // Helper function to convert total seconds back to M.SS.SS format
    function secondsToTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds === null) return "";
        let sign = totalSeconds < 0 ? "-" : "";
        totalSeconds = Math.abs(totalSeconds);
        
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let milliseconds = Math.round((totalSeconds - (minutes * 60) - seconds) * 100);

        if (milliseconds >= 100) {
            milliseconds = 0;
            seconds += 1;
        }
        if (seconds >= 60) {
            seconds = 0;
            minutes += 1;
        }

        let secStr = seconds < 10 ? "0" + seconds : seconds;
        let msStr = milliseconds < 10 ? "0" + milliseconds : milliseconds;

        return sign + minutes + "." + secStr + "." + msStr;
    }

    let groups = [
        { startInput: 1, avgOutput: 17, rangeOutput: 1, name: "Shoes Only" },
        { startInput: 5, avgOutput: 18, rangeOutput: 2, name: "Blinkers" },
        { startInput: 9, avgOutput: 19, rangeOutput: 3, name: "Cheekpieces" },
        { startInput: 13, avgOutput: 20, rangeOutput: 4, name: "Tongue Tie" }
    ];

    let groupSeconds = {};

    groups.forEach(g => {
        let validValues = [];
        for (let i = 0; i < 4; i++) {
            let inputId = 's3_input_' + (g.startInput + i);
            let val = document.getElementById(inputId).value;
            let sec = timeToSeconds(val);
            if (sec !== null && !isNaN(sec) && val.trim() !== "") {
                validValues.push(sec);
            }
        }

        let avgField = document.getElementById('s3_res_' + g.avgOutput);
        let rangeField = document.getElementById('s3_range_' + g.rangeOutput);

        avgField.style.color = '';

        if (validValues.length > 0) {
            let sum = validValues.reduce((a, b) => a + b, 0);
            let avg = sum / validValues.length;
            groupSeconds[g.avgOutput] = avg;
            avgField.value = secondsToTime(avg);

            let maxVal = Math.max(...validValues);
            let minVal = Math.min(...validValues);
            let rangeVal = maxVal - minVal;
            rangeField.value = secondsToTime(rangeVal);
        } else {
            avgField.value = "";
            rangeField.value = "";
            groupSeconds[g.avgOutput] = null;
        }
    });

    // Comparison against Shoes Only base time (s3_res_17) & collect green results
    let baseTime = groupSeconds[17];
    let winningAdds = [];

    if (baseTime !== null && baseTime !== undefined) {
        let equipmentMappings = [
            { id: 18, label: "Blinkers" },
            { id: 19, label: "Cheekpieces" },
            { id: 20, label: "Tongue Tie" }
        ];

        equipmentMappings.forEach(eq => {
            let field = document.getElementById('s3_res_' + eq.id);
            let val = groupSeconds[eq.id];

            if (val !== null && val !== undefined) {
                let diff = val - baseTime;
                if (diff > 0) {
                    field.style.color = '#dc3545';
                    field.value = '+' + secondsToTime(Math.abs(diff));
                } else if (diff < 0) {
                    field.style.color = '#28a745';
                    field.value = '-' + secondsToTime(Math.abs(diff));
                    winningAdds.push(eq.label);
                } else {
                    field.style.color = '';
                    field.value = secondsToTime(val);
                }
            }
        });
    }

    // Retrieve distance and going cleanly from span elements or localStorage fallbacks
    let distSpan = document.getElementById('display_distance_3');
    let goingSpan = document.getElementById('display_winning_going_3');

    let selectedDistance = distSpan ? distSpan.textContent.replace(/[()]/g, '').trim() : "";
    if (!selectedDistance || selectedDistance === "-") {
        selectedDistance = localStorage.getItem('selectedDistance') || "-";
    }

    let winningGoing = goingSpan ? goingSpan.textContent.trim() : "";
    if (!winningGoing || winningGoing === "-") {
        winningGoing = localStorage.getItem('overallBestGoing') || "-";
    }

    // Format winning adds string nicely with proper 'and' conjunctions
    let addsText = "none";
    if (winningAdds.length === 1) {
        addsText = winningAdds[0];
    } else if (winningAdds.length === 2) {
        addsText = winningAdds[0] + " and " + winningAdds[1];
    } else if (winningAdds.length > 2) {
        addsText = winningAdds.slice(0, -1).join(", ") + ", and " + winningAdds[winningAdds.length - 1];
    }

    // Populate Summary Box
    let summaryContent = document.getElementById('step4-summary-content');
    if (summaryContent) {
        summaryContent.innerHTML = `
            At your horses selected distance of “<strong>${selectedDistance}</strong>”<br><br>
            This horse will be ultimately be best on “<strong>${winningGoing}</strong>” if all goings are 100%.<br><br>
            In addition to shoes this horse likes to run with “<strong>${addsText}</strong>”.
        `;
    }
}

function toggleTip() {
    let tipBox = document.getElementById('tip-text-box');
    if (tipBox) {
        if (tipBox.style.display === 'none' || tipBox.style.display === '') {
            tipBox.style.display = 'block';
        } else {
            tipBox.style.display = 'none';
        }
    }
}

// Step Four Clear Function (Fully Resetting Inputs, Averages, Ranges, Colors, and Summary)
function clearStep4() {
    // 1. Clear all 16 input run fields
    for (let i = 1; i <= 16; i++) {
        let inputEl = document.getElementById('s3_input_' + i);
        if (inputEl) {
            inputEl.value = '';
        }
        
        let rowEl = document.getElementById('s3_row_' + i);
        if (rowEl) {
            rowEl.classList.remove('winner-row');
        }
    }

    // 2. Clear all Average result output fields (IDs 17 to 20) and reset their text colors
    [17, 18, 19, 20].forEach(id => {
        let avgField = document.getElementById('s3_res_' + id);
        if (avgField) {
            avgField.value = '';
            avgField.style.color = '';
        }
    });

    // 3. Clear all Range output fields (IDs 1 to 4)
    [1, 2, 3, 4].forEach(id => {
        let rangeField = document.getElementById('s3_range_' + id);
        if (rangeField) {
            rangeField.value = '';
        }
    });

    // 4. Reset Step 4 summary box back to default placeholder text
    let summaryContent = document.getElementById('step4-summary-content');
    if (summaryContent) {
        summaryContent.innerHTML = `Click calculate to generate equipment performance summaries and optimal setup recommendations.`;
    }

    console.log('Calculator Step 4 fully cleared!');
}