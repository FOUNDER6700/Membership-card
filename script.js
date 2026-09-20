document.addEventListener("DOMContentLoaded", () => {
    // 1. DYNAMIC SCALING FOR MOBILE PREVIEW
    // This makes sure the 800x500 card fits neatly on your phone screen, 
    // but remains native 800x500 in the DOM for high-quality export.
    const scalerWrapper = document.getElementById('card-scaler');
    const cardElement = document.getElementById('membership-card');

    function resizeCardPreview() {
        // Get the current width of the container on your phone
        const containerWidth = scalerWrapper.clientWidth;
        // Calculate the scale needed to shrink the 800px card to fit
        const scale = containerWidth / 800;
        // Apply CSS transform to visually shrink it
        cardElement.style.transform = `scale(${scale})`;
    }

    // Run on load and if phone orientation changes
    window.addEventListener('resize', resizeCardPreview);
    resizeCardPreview();

    // 2. INSTANT TEXT UPDATES
    const inputs = {
        codename: document.getElementById('input-codename'),
        id: document.getElementById('input-id'),
        status: document.getElementById('input-status'),
        date: document.getElementById('input-date')
    };

    const outputs = {
        codename: document.getElementById('card-codename'),
        id: document.getElementById('card-id'),
        status: document.getElementById('card-status'),
        date: document.getElementById('card-date')
    };

    // Update text instantly on input
    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', (e) => {
            outputs[key].textContent = e.target.value || '-';
        });
    });

    // 3. RANK DROPDOWN LOGIC
    const rankSelect = document.getElementById('input-rank');
    const rankTextOutput = document.getElementById('card-rank-text');
    const rankSymbolOutput = document.getElementById('card-rank-symbol');

    rankSelect.addEventListener('change', (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        rankTextOutput.textContent = selectedOption.value;
        rankSymbolOutput.textContent = selectedOption.getAttribute('data-symbol');
    });

    // 4. DOWNLOAD AS PNG LOGIC
    const downloadBtn = document.getElementById('download-btn');

    downloadBtn.addEventListener('click', () => {
        // Change button text to show it's working
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "GENERATING...";
        downloadBtn.style.opacity = "0.7";

        // We temporarily remove the scale transform so html2canvas captures 
        // the native 800x500 resolution perfectly.
        cardElement.style.transform = 'scale(1)';

        // Use html2canvas to capture ONLY the #membership-card div
        html2canvas(cardElement, {
            scale: 3, // Multiplies 800x500 by 3 for a crisp, high-res image (2400x1500)
            backgroundColor: "#050505",
            logging: false,
            useCORS: true
        }).then(canvas => {
            // Put the preview scale back immediately
            resizeCardPreview();

            // Create an invisible link to trigger the download
            const imageStr = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.download = `Obsidian_Circle_${inputs.codename.value.replace(/\s+/g, '_')}.png`;
            link.href = imageStr;
            link.click();

            // Reset button
            downloadBtn.textContent = originalText;
            downloadBtn.style.opacity = "1";
        }).catch(err => {
            console.error("Error generating image: ", err);
            alert("Failed to generate image. Please try again.");
            resizeCardPreview();
            downloadBtn.textContent = originalText;
            downloadBtn.style.opacity = "1";
        });
    });
});
          
