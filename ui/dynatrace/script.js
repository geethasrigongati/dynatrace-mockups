document.addEventListener("DOMContentLoaded", () => {

    // ----- Login Logic -----
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        // We are on the login page
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // Simulate authentication and redirect to dashboard
            const btn = loginForm.querySelector('button');
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';
            setTimeout(() => {
                window.location.href = "index.html";
            }, 800);
        });
        return; // Skip dashboard logic
    }

    // ----- Dashboard Navigation Logic -----
    const dashboardLinks = document.querySelectorAll(".dashboard-link[data-target]");
    const viewTitle = document.getElementById("currentViewTitle");
    const alertBadge = document.getElementById("alertBadge");

    dashboardLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Remove active class from all
            dashboardLinks.forEach(l => l.classList.remove("active"));

            // Add active class to clicked
            link.classList.add("active");

            // Hide all views
            document.querySelectorAll(".view-content").forEach(view => {
                view.style.display = "none";
            });

            // Show target view
            const targetId = link.getAttribute("data-target");
            const targetView = document.getElementById(`view-${targetId}`);

            if (targetView) {
                targetView.style.display = "block";
            } else {
                document.getElementById("view-fallback").style.display = "flex";
            }

            // Update Header Title
            const titleText = link.childNodes[0].nodeValue.trim();
            // Simple logic to map the title correctly based on target
            if (targetId === 'gwpc-trans') {
                viewTitle.innerText = "GWPC Transaction Dashboard";
                alertBadge.style.display = "inline-flex"; // show alert badge like screenshot
            } else if (targetId === 'gwpc-iib') {
                viewTitle.innerText = "GWPC IIB Metrics";
                alertBadge.style.display = "none";
            } else if (targetId === 'gwpc-resp') {
                viewTitle.innerText = "GWPC Response Monitoring";
                alertBadge.style.display = "none";
            } else {
                viewTitle.innerText = titleText;
                alertBadge.style.display = "none";
            }
        });
    });

    // ----- Logout Logic -----
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    // ----- Render mock timeline SVG chart (only on index) -----
    const container = document.getElementById('timelineChart');
    if (container) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "none");
        svg.style.overflow = "visible";

        const width = 1000;
        const height = 250;
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        const numPoints = 150;
        let pathData = `M 0,${height} L 0,${height - 30} `;
        let currentY = height - 50;

        for (let i = 1; i <= numPoints; i++) {
            const x = (i / numPoints) * width;
            const spike = (Math.random() > 0.8) ? (Math.random() * 80) : 0;
            const trend = Math.sin(i * 0.1) * 30;
            const noise = (Math.random() - 0.5) * 20;

            let y = height - Math.max(20, Math.min(height - 10, currentY + trend + noise + spike));

            if (i > numPoints * 0.4 && i < numPoints * 0.6) {
                y -= Math.random() * 100 + 50;
            }

            pathData += `L ${x},${Math.max(10, y)} `;
        }

        pathData += `L ${width},${height} Z`;

        const defs = document.createElementNS(svgNS, "defs");
        const linearGradient = document.createElementNS(svgNS, "linearGradient");
        linearGradient.setAttribute("id", "areaFill");
        linearGradient.setAttribute("x1", "0%");
        linearGradient.setAttribute("y1", "0%");
        linearGradient.setAttribute("x2", "0%");
        linearGradient.setAttribute("y2", "100%");

        const stop1 = document.createElementNS(svgNS, "stop");
        stop1.setAttribute("offset", "0%");
        stop1.setAttribute("stop-color", "rgba(59, 130, 246, 0.4)");

        const stop2 = document.createElementNS(svgNS, "stop");
        stop2.setAttribute("offset", "100%");
        stop2.setAttribute("stop-color", "rgba(59, 130, 246, 0.01)");

        linearGradient.appendChild(stop1);
        linearGradient.appendChild(stop2);
        defs.appendChild(linearGradient);
        svg.appendChild(defs);

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "url(#areaFill)");
        path.setAttribute("stroke", "#3b82f6");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("vector-effect", "non-scaling-stroke");

        svg.appendChild(path);
        container.appendChild(svg);
    }
});
