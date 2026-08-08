// Helper: Convert "M.SS.HH" string to total hundredths of a second for accurate comparison
function parseTimeToHundreds(timeStr) {
    if (!timeStr || !timeStr.includes('.')) return null;
    const parts = timeStr.trim().split('.');
    if (parts.length < 2) return null;

    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    const hundreds = parts[2] ? parseInt(parts[2], 10) : 0;

    return (mins * 60 * 100) + (secs * 100) + hundreds;
}

// Helper: Convert total hundredths back into "M.SS.HH" format (with a minus sign if negative)
function formatHundredsToTime(totalHundreds) {
    let isNeg = totalHundreds < 0;
    let absVal = Math.abs(totalHundreds);

    const mins = Math.floor(absVal / 6000);
    const secs = Math.floor((absVal % 6000) / 100);
    const hundreds = absVal % 100;

    const formatted = `${mins}.${String(secs).padStart(2, '0')}.${String(hundreds).padStart(2, '0')}`;
    return isNeg ? `-${formatted}` : formatted;
}

function calculateShoes() {
    // Get the baseline value from "Shoes Only" (Row 1)
    const baselineInput = document.getElementById('s2_input_1a').value;
    const baselineVal = parseTimeToHundreds(baselineInput);
    const summaryBox = document.getElementById('calc-summary-2'); // Targeted exclusively to Calculator 02

    // Collect all inputs, map them to their result boxes, and assign equipment names
    const inputs = [
        { id: 's2_result_1', val: baselineVal, name: 'Shoes Only' },
        { id: 's2_result_2', val: parseTimeToHundreds(document.getElementById('s2_input_2a').value), name: 'Blinkers' },
        { id: 's2_result_3', val: parseTimeToHundreds(document.getElementById('s2_input_3a').value), name: 'Cheekpieces' },
        { id: 's2_result_4', val: parseTimeToHundreds(document.getElementById('s2_input_4a').value), name: 'a Tongue Tie' }
    ];

    // If there is no baseline entered, clear results and hide summary
    if (baselineVal === null) {
        inputs.forEach(item => {
            const resultBox = document.getElementById(item.id);
            if (resultBox) {
                resultBox.value = '';
                resultBox.style.color = '';
                resultBox.style.fontWeight = 'normal';
            }
        });
        if (summaryBox) summaryBox.style.display = 'none';
        return;
    }

    let preferredEquipment = []; // Array to store equipment that improves time

    // Process each row against the baseline
    inputs.forEach((item, index) => {
        const resultBox = document.getElementById(item.id);
        
        // Handle the baseline row itself (Shoes Only)
        if (index === 0) {
            resultBox.value = '0.00.00';
            resultBox.style.color = '#1b5e20'; // Dark green for baseline
            resultBox.style.fontWeight = 'bold';
            return;
        }

        if (item.val === null) {
            resultBox.value = '';
            resultBox.style.color = '';
            resultBox.style.fontWeight = 'normal';
            return;
        }

        // Calculation: Equipment Time minus Baseline Time
        const diff = item.val - baselineVal;

        resultBox.value = diff === 0 ? '0.00.00' : formatHundredsToTime(diff);

        // Color coding: Negative is green (faster), Positive is red (slower)
        if (diff < 0) {
            resultBox.style.color = '#2e7d32'; // Green
            preferredEquipment.push(item.name); // Add to the summary list if it's faster
        } else if (diff > 0) {
            resultBox.style.color = '#d32f2f'; // Red
        } else {
            resultBox.style.color = '#333333'; // Neutral if exact match
        }
        
        resultBox.style.fontWeight = 'bold';
    });

// Generate and display the dynamic summary for Calculator 02
    if (summaryBox) {
        let equipText = "Shoes Only";
        
        if (preferredEquipment.length > 0) {
            if (preferredEquipment.length === 1) {
                equipText = preferredEquipment[0];
            } else if (preferredEquipment.length === 2) {
                equipText = preferredEquipment[0] + " and " + preferredEquipment[1];
            } else {
                equipText = preferredEquipment[0] + ", " + preferredEquipment[1] + ", and " + preferredEquipment[2];
            }
        }

        // Retrieve saved values from Step 1 and Step 2 (Calculator 01)
        let savedDistance = localStorage.getItem('selectedDistance') || "2M";
        let bestGoing = localStorage.getItem('overallBestGoing') || "determined going";

// Construct the new summary sentence structure with bold Shoes, removed brackets, and proper 'and a' formatting
        let mainSummaryText = `<strong>Summary:</strong> In addition to <strong>shoes</strong> your horse likes to run with <strong>${equipText}</strong> 
        and will definitely be within its comfort zone running at <strong>${savedDistance}</strong>. It will ultimately 
        be best on <strong>${bestGoing}</strong> going.`; 
        // Combines the main summary with your caution lines
        summaryBox.innerHTML = `${mainSummaryText}<br>That should be 7 runs completed, you still have 5 left. We will use the remaing training runs to verify our results so far.<br>
<span style="color: red;">Caution: The variance between training runs can be large, so what is calculated is only an indication.</span>`;

        summaryBox.style.display = 'block';
    }
}

function clearShoes() {
    // Clear inputs and result fields for Calculator 2
    for (let i = 1; i <= 4; i++) {
        const inputEl = document.getElementById(`s2_input_${i}a`);
        const resultEl = document.getElementById(`s2_result_${i}`);
        if (inputEl) inputEl.value = '';
        if (resultEl) {
            resultEl.value = '';
            resultEl.style.color = '';
            resultEl.style.fontWeight = 'normal';
        }
    }
    
    // Hide and empty Calculator 2's summary box on clear
    const summaryBox = document.getElementById('calc-summary-2');
    if (summaryBox) {
        summaryBox.style.display = 'none';
        summaryBox.innerHTML = '';
    }
}