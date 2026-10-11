(async function autoCrawlByUnitOutlineMD() {
    let allCourseData = [];
    let processedUnits = new Set();
    let currentSection = "";

    async function waitForLoading() {
        let retries = 0;
        while (retries < 20) {
            let isLoading = Array.from(document.querySelectorAll('div, span, p'))
                .some(el => el.innerText && el.innerText.trim().toLowerCase() === 'loading...');
            if (!isLoading) break;
            await new Promise(r => setTimeout(r, 500));
            retries++;
        }
    }

    function downloadMarkdownFile(content, filename = "Michigan_Real_Estate_Course_Structure.md") {
        let blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    console.log("%c🚀 Bắt đầu cào theo Cách 2 (Khoanh vùng UNIT OUTLINE)...", "color: #00ff00; font-weight: bold; font-size: 14px;");

    while (true) {
        await waitForLoading();
        await new Promise(r => setTimeout(r, 1500));

        // CÁCH 2: Khoanh vùng chính xác vào khối .segment-box.unit-box chứa UNIT OUTLINE
        let unitBox = document.querySelector('.segment-box.unit-box') || document;

        let sectionEl = unitBox.querySelector('.section-title');
        let unitEl = unitBox.querySelector('.unit-title');

        let sectionName = sectionEl ? sectionEl.innerText.trim() : "";
        let unitName = unitEl ? unitEl.innerText.trim() : "";

        let unitKey = `${sectionName} - ${unitName}`;

        if (unitName && !processedUnits.has(unitKey)) {
            processedUnits.add(unitKey);

            // Trích xuất Lessons từ ces-unit-toc
            let lessonElements = Array.from(document.querySelectorAll('ces-unit-toc li, ces-unit-toc .lesson-title, ces-unit-toc div, ces-unit-toc span, ces-unit-toc a'));
            let lessons = lessonElements
                .map(el => el.innerText ? el.innerText.trim() : '')
                .filter(text => (
                    text.startsWith('Lesson ') || 
                    text.startsWith('Introduction & Objectives')
                ));

            let uniqueLessons = [...new Set(lessons)];

            let unitLogBlock = [];

            if (sectionName && sectionName !== currentSection) {
                currentSection = sectionName;
                allCourseData.push(`\n# ${currentSection}`);
            }

            if (sectionName) {
                unitLogBlock.push(sectionName);
            }

            allCourseData.push(`\n## ${unitName}`);
            unitLogBlock.push(unitName);

            uniqueLessons.forEach(l => {
                allCourseData.push(`- ${l}`);
                unitLogBlock.push(l);
            });

            console.log(`\n%cDONE >>>`, "color: #00ff00; font-weight: bold;");
            console.log(unitLogBlock.join('\n'));
        }

        // Tìm nút Next / Continue
        let nextBtn = Array.from(document.querySelectorAll('button, a'))
            .find(el => {
                let txt = el.innerText ? el.innerText.trim() : '';
                return (txt.includes('Continue to Unit') || txt.includes('Next Unit')) && el.offsetParent !== null;
            });

        if (!nextBtn) {
            console.log("\n%c🎉 Hoàn thành cào toàn bộ khóa học! Đang tải file Markdown...", "color: #00ffff; font-weight: bold; font-size: 16px;");
            let markdownContent = allCourseData.join('\n').trim();
            downloadMarkdownFile(markdownContent, "Michigan_Real_Estate_Course_Structure.md");
            console.log("%c✅ File Michigan_Real_Estate_Course_Structure.md đã được tải thành công!", "color: #00ff00; font-weight: bold; font-size: 14px;");
            break;
        }

        nextBtn.click();
        await new Promise(r => setTimeout(r, 2000));
    }
})();