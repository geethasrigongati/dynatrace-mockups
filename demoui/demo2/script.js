document.addEventListener('DOMContentLoaded', () => {
    // Generate mock SVG data for CPU usage
    const cpuSvg = generateStackedSvg([
        { color: '#55c5cc', volatility: 20, base: 10 }, // user
        { color: '#fcebbc', volatility: 35, base: 20 }, // wait
        { color: '#f1f2f5', volatility: 5, base: 0 }     // idle at bottom
    ], 100);
    document.getElementById('cpuChart').appendChild(cpuSvg);

    // Generate mock SVG data for Memory usage
    const memSvg = generateMemorySvg();
    document.getElementById('memChart').appendChild(memSvg);

    // Generate mock SVG data for VM Memory usage
    const vmMemSvg = generateLineSvg('#5a84b5', 10, 20);
    // Add horizontal line for limit
    const hrLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hrLine.setAttribute('x1', '0');
    hrLine.setAttribute('y1', '10%');
    hrLine.setAttribute('x2', '100%');
    hrLine.setAttribute('y2', '10%');
    hrLine.setAttribute('stroke', '#285288');
    hrLine.setAttribute('stroke-width', '2');
    vmMemSvg.appendChild(hrLine);
    document.getElementById('vmMemChart').appendChild(vmMemSvg);

    // Generate mock SVG data for Traffic
    const trafficSvg = generateSpikyLineSvg('#3b348f', 30, 10);
    const trafficSvg2 = generateSpikyLineSvg('#5a84b5', 15, 5);
    trafficSvg.appendChild(trafficSvg2.querySelector('path'));
    document.getElementById('trafficChart').appendChild(trafficSvg);

    // Add simple click interactions for the right side nav
    const scrollLinks = document.querySelectorAll('.scroll-list a');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active class from all
            scrollLinks.forEach(l => {
                l.classList.remove('active');
                l.classList.remove('text-teal');
            });
            // Add active class to clicked
            e.target.classList.add('active');
            e.target.classList.add('text-teal');
        });
    });

    // Sidebar classic nav highlight
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!item.classList.contains('text-red')) { // Don't highlight problems classic
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
});

// Helper functions to generate SVGs dynamically

function createSvgElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.overflow = 'visible';
    return svg;
}

function generateStackedSvg(layers, pointsCount) {
    const svg = createSvgElement();
    const height = 100;
    const width = 100;

    // Reverse so first item is front
    layers.reverse().forEach((layer, idx) => {
        let pathD = `M 0,${height} `;

        for (let i = 0; i <= pointsCount; i++) {
            const x = (i / pointsCount) * width;
            let val = layer.base + (Math.random() * layer.volatility);
            if (i % 6 === 0) val += 20; // spikes
            // stack over previous (rough mock)
            let y = height - Math.min(height, val + (idx * 10));
            pathD += `L ${x},${y} `;
        }

        pathD += `L ${width},${height} Z`;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('d', pathD);
        path.setAttribute('fill', layer.color);
        // path.setAttribute('stroke', 'white');
        // path.setAttribute('stroke-width', '0.5');
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.appendChild(path);
    });

    return svg;
}

function generateMemorySvg() {
    const svg = createSvgElement();
    // Reclaimable (light blue)
    let d1 = `M 0,100 `;
    // Used (dark blue)
    let d2 = `M 0,100 `;

    for (let i = 0; i <= 100; i++) {
        let x = i;
        // Mock sawtooth pattern
        let rVal = 30 + (i % 10) * 3;
        let uVal = 10 + (i % 12) * 2;
        d1 += `L ${x},${100 - rVal} `;
        d2 += `L ${x},${100 - uVal} `;
    }
    d1 += `L 100,100 Z`;
    d2 += `L 100,100 Z`;

    const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p1.setAttribute('d', d1);
    p1.setAttribute('fill', '#5a84b5');
    p1.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(p1);

    const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p2.setAttribute('d', d2);
    p2.setAttribute('fill', '#285288');
    p2.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(p2);

    // Limit line
    const hrLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    hrLine.setAttribute('x1', '0');
    hrLine.setAttribute('y1', '10%');
    hrLine.setAttribute('x2', '100%');
    hrLine.setAttribute('y2', '10%');
    hrLine.setAttribute('stroke', '#55c5cc');
    hrLine.setAttribute('stroke-width', '2');
    svg.appendChild(hrLine);

    return svg;
}

function generateLineSvg(color, base, vol) {
    const svg = createSvgElement();
    let d = `M 0,${100 - base} `;
    for (let i = 0; i <= 100; i++) {
        let x = i;
        let y = 100 - (base + (Math.random() * vol));
        d += `L ${x},${y} `;
    }
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(path);
    return svg;
}

function generateSpikyLineSvg(color, base, vol) {
    const svg = createSvgElement();
    let d = `M 0,100 `;
    for (let i = 0; i <= 100; i++) {
        let x = i;
        let y = 100 - base;
        if (Math.random() > 0.8) y -= Math.random() * 60; // Spikes
        else y -= Math.random() * vol;
        d += `L ${x},${y} `;
    }
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(path);
    return svg;
}
