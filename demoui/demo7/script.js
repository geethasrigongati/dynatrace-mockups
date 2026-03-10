document.addEventListener('DOMContentLoaded', () => {
    // demo7 is mostly static/empty, but we can add the nav highlight logic

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
            if (!item.classList.contains('text-red')) {
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
});
