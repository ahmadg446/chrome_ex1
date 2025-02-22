document.getElementById('extractButton').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
          const pageText = document.body.innerText;
          const lines = pageText.split('\n').filter(line => line.trim() !== '');
          const assignments = [];
          let currentCourse = '';

          lines.forEach(line => {
              const datePattern = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b\s+\d{1,2}/i;
              const timePattern = /\b\d{1,2}:\d{2}(?:[ap]m)?\b/i;

              if (line.includes('Calendar:')) {
                  currentCourse = line.split('Calendar:')[1].trim();
              } else if (datePattern.test(line) || timePattern.test(line)) {
                  assignments.push({
                      course: currentCourse,
                      assignment_title: line.trim(),
                      due_date: datePattern.test(line) ? line.match(datePattern)[0] : null,
                      time: timePattern.test(line) ? line.match(timePattern)[0] : null
                  });
              }
          });

          assignments.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
          return assignments;
      }
  }, (results) => {
      if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          return;
      }
      const assignments = results[0].result;
      const previewElement = document.getElementById('dataPreview');
      const format = document.getElementById('fileFormat').value;

      let outputData;
      if (format === 'csv') {
          outputData = 'Course,Assignment Title,Due Date,Time\n' +
              assignments.map(a => `${a.course},${a.assignment_title},${a.due_date},${a.time}`).join('\n');
      } else if (format === 'txt') {
          outputData = assignments.map(a => `Course: ${a.course}\nAssignment: ${a.assignment_title}\nDue Date: ${a.due_date}\nTime: ${a.time}\n`).join('\n');
      } else {
          outputData = JSON.stringify(assignments, null, 2);
      }

      previewElement.value = outputData;

      document.getElementById('downloadButton').onclick = () => {
          const blob = new Blob([outputData], { type: format === 'json' ? 'application/json' : 'text/plain' });
          const url = URL.createObjectURL(blob);
          const today = new Date().toISOString().split('T')[0];
          const fileName = `${title}_${today}.${format}`;          

          chrome.downloads.download({
              url: url,
              filename: fileName,
              saveAs: true
          });
      };
  });
});
