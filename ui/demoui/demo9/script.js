document.addEventListener('DOMContentLoaded', () => {
    // Generate Throughput Mini Bars
    const barsContainer = document.getElementById('miniThroughputBars');
    const barCount = 12;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        bar.className = 'throughput-bar';
        const height = 5 + Math.random() * 15;
        bar.style.width = '3px';
        bar.style.height = `${height}px`;
        bar.style.backgroundColor = (i === barCount - 1) ? '#0073e6' : '#ccc';
        barsContainer.appendChild(bar);
    }

    // Mock Response Time Chart
    renderSparkline('responseTimeChart', '#0073e6');

    // Mock Failure Rate Chart
    renderSparkline('failureRateChart', '#ccc');
});

function renderSparkline(elementId, color) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');

    let pathD = "M 0 80 ";
    const points = 20;
    for (let i = 0; i <= points; i++) {
        const x = (i / points) * 100;
        const y = 50 + Math.random() * 30;
        pathD += `L ${x} ${y} `;

        // Add small dots
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '1.5');
        circle.setAttribute('fill', color);
        svg.appendChild(circle);
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', pathD);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1');
    svg.appendChild(path);

    container.appendChild(svg);
}
