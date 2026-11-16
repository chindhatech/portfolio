# Chindhamani Healthcare and Laboratories

A static, responsive clinic website built with HTML, CSS, and vanilla JavaScript. No build step, backend, or package installation is required.

## Run locally

Open `index.html` in a browser. For a local web server, run one of these commands from the project folder:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000>.

The site uses Google Fonts when an internet connection is available. The local SVG illustrations, styles, and interactions work without external libraries.

## Project files

- `index.html` — page content, metadata, and structured data
- `css/style.css` — responsive layout and visual design
- `js/script.js` — navigation, scroll effects, WhatsApp links, form validation, and dynamic copyright year
- `assets/images/` — supplied clinic wordmark and photograph of Dr. G. Jayasri Kavya
- `assets/icons/` — supplied clinic emblem used in the header and as the browser icon

The contact form is frontend-only. It validates the entered details and opens WhatsApp with a prefilled enquiry; it does not store or transmit form data automatically.

## Deploy

The project can be published as-is from its root folder on any static hosting provider.

### GitHub Pages

1. Push the project files to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Choose **Deploy from a branch**, select the branch and `/ (root)` folder, then save.
4. GitHub Pages will show the published site URL in the Pages settings.

### Netlify

1. Import the repository in Netlify, or drag the project folder into Netlify Drop.
2. Leave the build command empty.
3. Set the publish directory to `.` (the project root).
4. Deploy the site.

### Vercel

1. Import the repository in Vercel.
2. Select **Other** as the framework preset.
3. Leave the build command empty and set the output directory to `.`.
4. Deploy the project.

## Before publishing

- The supplied doctor photograph is used in both doctor image slots. Replace it only if the clinic provides a preferred image.
- Confirm clinic contact details and the availability of specific laboratory services before adding more detailed claims.
- Set the website's canonical URL and social sharing image metadata if a production domain and final share image are available.
