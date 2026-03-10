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
});
