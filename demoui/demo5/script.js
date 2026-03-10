document.addEventListener('DOMContentLoaded', () => {
    // Generate mock SVG data for CPU usage (Mostly low spikes of yellow/cyan, data is 10.9%)
    const cpuSvg = generateStackedSvg([
        { color: '#55c5cc', volatility: 4, base: 3 }, // cyan (user)
        { color: '#fcebbc', volatility: 8, base: 4 }, // yellow (wait)
        { color: '#f1f2f5', volatility: 0, base: 0 }  // idle
    ], 100, 20); // pass max value to squish it down visually
    document.getElementById('cpuChart').appendChild(cpuSvg);

    // Generate mock SVG data for Memory usage (solid two-tone blue block)
    const memSvg = generateStaticMemorySvg();
    document.getElementById('memChart').appendChild(memSvg);

    // Generate mock SVG data for VM Memory usage (flat line near bottom)
    const vmMemSvg = generateDoubleLineSvg('#48327a', '#a5aae3', 5, 8);
    document.getElementById('vmMemChart').appendChild(vmMemSvg);

    // Generate mock SVG data for Traffic (spiky purple/blue)
    const trafficSvg = generateSpikyLineSvg('#3b348f', 15, 80); // Dark Purple out
    const trafficSvg2 = generateSpikyLineSvg('#5a84b5', 10, 40); // Blue in
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

function generateStackedSvg(layers, pointsCount, maxChartValue = 100) {
    const svg = createSvgElement();
    const height = 100;
    const width = 100;

    // Reverse so first item is front
    layers.reverse().forEach((layer, idx) => {
        let pathD = `M 0,${height} `;

        for (let i = 0; i <= pointsCount; i++) {
            const x = (i / pointsCount) * width;
            let val = layer.base + (Math.random() * layer.volatility);
            if (i % 8 === 0) val += 15; // little spikes

            // Map value relative to maxChartValue so it sits low on the graph
            let mappedY = (val / maxChartValue) * height;

            let y = height - Math.min(height, mappedY + (idx * 2));
            pathD += `L ${x},${y} `;
        }

        pathD += `L ${width},${height} Z`;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute('d', pathD);
        path.setAttribute('fill', layer.color);
        path.setAttribute('vector-effect', 'non-scaling-stroke');
        svg.appendChild(path);
    });

    return svg;
}

function generateStaticMemorySvg() {
    // This graph is just two large solid chunks of color
    const svg = createSvgElement();

    // Bottom block (dark blue)
    let d1 = `M 0,100 L 0,70 L 100,70 L 100,100 Z`;
    const p1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p1.setAttribute('d', d1);
    p1.setAttribute('fill', '#285288');
    svg.appendChild(p1);

    // Top block (light blue)
    let d2 = `M 0,70 L 0,20 L 100,20 L 100,70 Z`;
    const p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p2.setAttribute('d', d2);
    p2.setAttribute('fill', '#5a84b5');
    svg.appendChild(p2);

    return svg;
}

function generateDoubleLineSvg(color1, color2, base1, base2) {
    const svg = createSvgElement();

    let d1 = `M 0,${100 - base1} `;
    let d2 = `M 0,${100 - base2} `;

    for (let i = 0; i <= 100; i++) {
        let x = i;
        let y1 = 100 - (base1 + (Math.random() * 2)); // very flat
        let y2 = 100 - (base2 + (Math.random() * 2)); // very flat
        d1 += `L ${x},${y1} `;
        d2 += `L ${x},${y2} `;
    }

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute('d', d1);
    path1.setAttribute('fill', 'none');
    path1.setAttribute('stroke', color1);
    path1.setAttribute('stroke-width', '1');
    path1.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(path1);

    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute('d', d2);
    path2.setAttribute('fill', 'none');
    path2.setAttribute('stroke', color2);
    path2.setAttribute('stroke-width', '1');
    path2.setAttribute('vector-effect', 'non-scaling-stroke');
    svg.appendChild(path2);

    return svg;
}

function generateSpikyLineSvg(color, base, spikeHeight) {
    const svg = createSvgElement();
    let d = `M 0,100 `;

    for (let i = 0; i <= 100; i++) {
        let x = i;
        let y = 100 - (base + (Math.random() * 5));
        // Random large spikes representing network traffic bursts
        if (Math.random() > 0.85) {
            y -= (Math.random() * spikeHeight);
            if (y < 0) y = 0; // Don't overflow top
        }
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
