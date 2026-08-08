function calculateRows() {
        let totalTimes = [];
        let parsedData = [];
        const rowNames = { 1: "Firm", 2: "Good", 3: "Soft", 4: "Heavy" };

        for (let i = 1; i <= 4; i++) {
            let rawInput = document.getElementById('input_' + i + 'a').value.trim();
            let totalHundredths = null;

            if (rawInput) {
                let parts = rawInput.split('.');
                let minutes = parseFloat(parts[0]) || 0;
                let seconds = parseFloat(parts[1]) || 0;
                let hundreds = parseFloat(parts[2]) || 0;

                totalHundredths = (minutes * 60 * 100) + (seconds * 100) + hundreds;
            }

            parsedData.push({ row: i, total: totalHundredths });
            if (totalHundredths !== null) {
                totalTimes.push(totalHundredths);
            }

            let rowElement = document.getElementById('row_' + i);
            let resultBox = document.getElementById('result_' + i);
            if (rowElement) rowElement.classList.remove('winner-row');
            if (resultBox) resultBox.classList.remove('result-orange-input');
        }

        let summaryBox = document.getElementById('calc-summary');
        if (totalTimes.length === 0) {
            if (summaryBox) summaryBox.style.display = 'none';
            return;
        }

        let minTime = Math.min(...totalTimes);
        let finalValuesList = [];
        let rowCalculations = [];

        parsedData.forEach(data => {
            let resultBox = document.getElementById('result_' + data.row);
            let goingInputBox = document.getElementById('going_' + data.row);
            let finalBox = document.getElementById('final_' + data.row);

            if (data.total === null) {
                if (resultBox) resultBox.value = "";
                if (goingInputBox) goingInputBox.value = "";
                if (finalBox) finalBox.value = "";
                return;
            }

            let diffHundredths = data.total - minTime;
            let diffMins = Math.floor(diffHundredths / (60 * 100));
            let remainder = diffHundredths % (60 * 100);
            let diffSecs = Math.floor(remainder / 100);
            let diffHundreds = remainder % 100;

            if (resultBox) {
                resultBox.value = `${String(diffMins).padStart(2, '0')}.${String(diffSecs).padStart(2, '0')}.${String(diffHundreds).padStart(2, '0')}`;
            }

            // Strips out the '%' sign if the user includes it
            let rawGoingVal = goingInputBox ? goingInputBox.value.trim().replace('%', '') : '';
            let goingPercentValue = parseFloat(rawGoingVal) || 0;
            
            let deductionValue = ((100 - goingPercentValue) / 10) * 0.25;
            let deductionHundredths = deductionValue * 100;
            let finalHundredths = data.total - deductionHundredths;

            finalValuesList.push({ row: data.row, finalHundredths: finalHundredths });
            rowCalculations.push({ row: data.row, diffHundredths: diffHundredths, finalHundredths: finalHundredths, finalBox: finalBox });
        });

        if (finalValuesList.length === 0) {
            if (summaryBox) summaryBox.style.display = 'none';
            return;
        }

        let lowestFinal = Math.min(...finalValuesList.map(item => item.finalHundredths));

        let bestCurrentRow = rowCalculations.reduce((min, curr) => curr.diffHundredths < min.diffHundredths ? curr : min, rowCalculations[0]);
        let bestFinalRow = rowCalculations.find(calc => calc.finalHundredths === lowestFinal);

        rowCalculations.forEach(calc => {
            let isNegative = calc.finalHundredths < 0;
            let absHundredths = Math.abs(calc.finalHundredths);

            let finalMins = Math.floor(absHundredths / (60 * 100));
            let finalRemainder = absHundredths % (60 * 100);
            let finalSecs = Math.floor(finalRemainder / 100);
            let finalHundreds = Math.round(finalRemainder % 100);

            let signPrefix = isNegative ? "-" : "";
            if (calc.finalBox) {
                calc.finalBox.value = `${signPrefix}${String(finalMins).padStart(2, '0')}.${String(finalSecs).padStart(2, '0')}.${String(finalHundreds).padStart(2, '0')}`;
            }

            let rowElement = document.getElementById('row_' + calc.row);
            let resultBox = document.getElementById('result_' + calc.row);

            if (rowElement) rowElement.classList.remove('winner-row');
            if (resultBox) resultBox.classList.remove('result-orange-input');

            // Green takes priority if it's the ultimate final winner
            if (calc.finalHundredths === lowestFinal) {
                if (rowElement) rowElement.classList.add('winner-row');
            }
            // Otherwise, style only the result input box orange if it equals 00.00.00
            else if (calc.diffHundredths === 0) {
                if (resultBox) resultBox.classList.add('result-orange-input');
            }
        });

// Generate dynamic summary text on separate lines
        if (summaryBox && bestCurrentRow && bestFinalRow) {
            let currentBestName = rowNames[bestCurrentRow.row];
            let overallBestName = rowNames[bestFinalRow.row];

            // ADD THESE TWO LINES TO SAVE DATA:
            let selectedDistance = document.getElementById('distance_dropdown_1').value;
            localStorage.setItem('selectedDistance', selectedDistance);
            localStorage.setItem('overallBestGoing', overallBestName);

            summaryBox.innerHTML = `At current going percentages, <strong>${currentBestName}</strong> is best.<br>Assuming all goings are 100%, then your horse will perform best on <strong>${overallBestName}</strong>.<br><span style="color: red;">Caution: The variance between training runs can be large, so what is calculated is only an indication.</span>`;
            summaryBox.style.display = 'block';
        }
    }