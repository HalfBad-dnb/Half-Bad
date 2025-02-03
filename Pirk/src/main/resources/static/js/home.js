const createHomePage = () => {
    // Create elements
    const html = document.querySelector('html');
    html.setAttribute('lang', 'en');

    const head = document.createElement('head');
    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');

    const metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');

    const title = document.createElement('title');
    title.textContent = 'Home Page';

    const linkCSS = document.createElement('link');
    linkCSS.setAttribute('rel', 'stylesheet');
    linkCSS.setAttribute('href', '/css/style.css'); // Ensure path is correct

    head.append(metaCharset, metaViewport, title, linkCSS);
    document.head.replaceWith(head);

    const body = document.createElement('body');

    // Create navigation bar
    const nav = document.createElement('nav');
    nav.classList.add('menu-bar'); // Ensure correct class name
    const ul = document.createElement('ul');

    const links = [
        { href: '/products', text: 'Products' },
        { href: '/about', text: 'About' },
        { href: '/profile', text: 'Profile' },
        { href: '/login', text: 'Login' },
        { href: '/register', text: 'Register' }
    ];

    links.forEach(linkData => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', linkData.href);
        a.textContent = linkData.text;
        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);

    // Main content section
    const mainContent = document.createElement('main');
    mainContent.style.paddingTop = '80px'; // Add space for navbar height
    const heading = document.createElement('h1');
    heading.textContent = 'Welcome to the Home Page!';

    const paragraph = document.createElement('p');
    paragraph.textContent = 'This is the homepage of the application.';

    mainContent.append(heading, paragraph);
    body.appendChild(mainContent);

    // Create footer
    const footer = document.createElement('footer');
    const footerParagraph = document.createElement('p');
    footerParagraph.textContent = '© 2025 Your Application Name. All Rights Reserved.';
    footer.appendChild(footerParagraph);
    body.appendChild(footer);

    // Append navigation bar first to ensure it is at the top
    document.body.replaceWith(body);

    // Add styles for fixed position navbar dynamically (in case the CSS isn't loaded correctly)
    const style = document.createElement('style');
    style.textContent = `
        /* Reset and basic styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }

        /* Navigation bar styling */
        nav.menu-bar {
            background-color: #333;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        nav.menu-bar ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            display: flex; /* Horizontal layout */
            justify-content: center; /* Center align the nav items */
        }

        nav.menu-bar ul li {
            padding: 14px 20px;
        }

        nav.menu-bar ul li a {
            color: white;
            text-decoration: none;
            font-size: 18px;
            display: block;
            transition: background-color 0.3s ease;
        }

        nav.menu-bar ul li a:hover {
            background-color: #575757;
            border-radius: 5px;
        }

        nav.menu-bar ul li a.active {
            background-color: #4CAF50;
            border-radius: 5px;
        }

        /* Main content section */
        main {
            padding-top: 80px; /* Add space for navbar height */
            text-align: center;
        }

        /* Footer styling */
        footer {
            background-color: #333;
            color: white;
            text-align: center;
            padding: 10px 0;
        }
    `;
    document.head.appendChild(style);
};

// Call the function to generate the home page
createHomePage();
