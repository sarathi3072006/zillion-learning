# QUICKSTART GUIDE - Zillion Learning

Get up and running with Zillion Learning in 5 minutes!

## 1. SETUP (2 minutes)

### Option A: Simple (Double-Click)
1. Navigate to the Zillion Learning folder
2. Double-click `index.html`
3. Website opens in your default browser ✅

### Option B: Local Server (Better)
1. Open Command Prompt/Terminal in the project folder
2. Run one of these commands:
   ```
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx http-server
   ```
3. Visit `http://localhost:8000` in your browser ✅

## 2. QUICK CUSTOMIZATION CHECKLIST

### Must-Change Items

- [ ] **Site Name/Logo** - Edit `index.html` navbar
  ```html
  <a class="navbar-brand" href="#">
    YOUR ACADEMY NAME
  </a>
  ```

- [ ] **Company Address** - Edit `pages/contact.html`
  ```html
  <p class="info-text">
    Your Address Here<br>
    City, State ZIP<br>
    Country
  </p>
  ```

- [ ] **Phone Numbers** - Edit `pages/contact.html`
  ```html
  <p class="info-text">
    +1 (555) YOUR-NUMBER<br>
  </p>
  ```

- [ ] **Email Addresses** - Edit all pages
  - support@brightpath.com → Your email
  - info@brightpath.com → Your email

- [ ] **Colors** - Edit `css/main.css` line 1-14
  ```css
  :root {
    --primary-color: #0066cc;     /* Your main color */
    --secondary-color: #00c4ff;   /* Your accent color */
  }
  ```

### Nice-to-Change Items

- [ ] **Course Details** - Edit `pages/courses.html`
  - Course names
  - Descriptions
  - Prices
  - Duration
  - Add/remove courses

- [ ] **Faculty Names** - Edit `pages/faculty.html`
  - Replace instructor names
  - Update qualifications
  - Modify experience levels
  - Change specializations

- [ ] **Testimonials** - Edit `pages/testimonials.html`
  - Update student names
  - Change testimonial text
  - Add new testimonials

- [ ] **Social Links** - Edit all pages footer
  ```html
  <a href="https://facebook.com/yourpage">
    <i class="fab fa-facebook-f"></i>
  </a>
  ```

## 3. ADDING YOUR BRANDING

### Logo
Place your logo image in `assets/` folder and reference it:
```html
<img src="../assets/logo.png" alt="Logo" style="height: 40px;">
```

### Favicon
Replace the current favicon link with your own:
```html
<link rel="icon" href="path/to/your-favicon.ico">
```

### Images
1. Create an `images/` folder inside `assets/`
2. Add your course/faculty images
3. Reference in HTML:
```html
<img src="../assets/images/course-name.jpg" alt="Course Name">
```

## 4. TESTING THE FEATURES

### Dark Mode
- Click moon icon (🌙) in top-right navbar
- Or press Alt + D

### Search & Filter
- Visit `Courses` page
- Type in search box to filter courses by name
- Use dropdown to filter by category

### Contact Form
- Visit `Contact` page
- Fill out the form
- Click Send Message
- Success message appears

### Animated Counters
- Visit Home page
- Scroll down to stats section
- Numbers animate as you scroll into view

### Scroll to Top
- Scroll down the page
- Click up arrow button in bottom-right
- Or press Alt + T

## 5. DEPLOYING ONLINE

### GitHub Pages (Free)
1. Create GitHub account
2. Create new repository
3. Upload all files
4. Go to Settings → Pages
5. Enable GitHub Pages
6. Site live in 2-3 minutes!

### Netlify (Free & Easy)
1. Go to netlify.com
2. Drag and drop your folder
3. Site automatically deployed!

### Traditional Hosting
1. Upload files via FTP to web server
2. Keep folder structure same
3. Make HTML files accessible

## 6. KEYBOARD SHORTCUTS

| Shortcut | Action |
|----------|--------|
| Alt + D | Toggle Dark Mode |
| Alt + T | Scroll to Top |

## 7. FOLDER STRUCTURE EXPLAINED

```
BrightPath Academy/
├── index.html              ← MAIN PAGE (start here)
├── css/
│   └── main.css           ← ALL STYLES (customization here)
├── js/
│   └── main.js            ← ALL INTERACTIONS
├── pages/
│   ├── about.html         ← Company info
│   ├── courses.html       ← Course listings
│   ├── faculty.html       ← Teacher profiles
│   ├── testimonials.html  ← Student reviews
│   └── contact.html       ← Contact form
├── assets/                ← ADD YOUR IMAGES HERE
└── README.md             ← Full documentation
```

## 8. CSS COLOR CUSTOMIZATION

Edit `css/main.css` to change the color scheme:

```css
:root {
  --primary-color: #0066cc;        /* Blue */
  --primary-dark: #0052a3;         /* Dark Blue */
  --primary-light: #e6f0ff;        /* Light Blue */
  --secondary-color: #00c4ff;      /* Cyan */
  --success-color: #28a745;        /* Green */
  --danger-color: #dc3545;         /* Red */
  --warning-color: #ffc107;        /* Yellow */
}
```

### Popular Color Combinations

**Green & Teal:**
```css
--primary-color: #00a86b;
--secondary-color: #00d4aa;
```

**Purple & Pink:**
```css
--primary-color: #8e44ad;
--secondary-color: #ff69b4;
```

**Orange & Red:**
```css
--primary-color: #ff6b35;
--secondary-color: #ff4500;
```

## 9. COMMON CUSTOMIZATIONS

### Change Company Name Throughout
Find and Replace (Ctrl + H):
- Find: "Zillion Learning"
- Replace: "Your Academy Name"

### Update All Contact Info
1. Open each page
2. Search for "support@brightpath.com"
3. Replace with your email
4. Do same for phone numbers and address

### Add New Course
1. Open `pages/courses.html`
2. Find a course card section
3. Copy entire `<div class="col-lg-4 col-md-6 mb-4">` block
4. Paste and modify:
   - Course title
   - Description
   - Price
   - Duration
   - Image gradient color

## 10. TROUBLESHOOTING

### Page looks broken
- Clear browser cache (Ctrl + Shift + Delete)
- Try different browser
- Check console for errors (F12)

### Form not working
- Check browser console for errors
- Make sure all fields are filled
- Verify email format is correct

### Images not showing
- Check image path is correct
- Make sure image file exists
- Use relative paths: `../assets/image.jpg`

### Styles not applying
- Hard refresh page (Ctrl + F5)
- Check CSS file path
- Make sure media queries are working

### Dark mode not working
- Check localStorage is enabled
- Try clearing cookies
- Check console for JavaScript errors

## 11. NEXT STEPS

### Phase 1: Setup & Customize (30 mins)
- [ ] Download/Extract files
- [ ] Change company name
- [ ] Update contact info
- [ ] Test locally

### Phase 2: Content (1 hour)
- [ ] Update all courses
- [ ] Update faculty
- [ ] Update testimonials
- [ ] Add your images

### Phase 3: Branding (1 hour)
- [ ] Change colors
- [ ] Add logo
- [ ] Update social links
- [ ] Customize footer

### Phase 4: Deploy (30 mins)
- [ ] Choose hosting
- [ ] Upload files
- [ ] Test live site
- [ ] Share with world!

## 12. GETTING HELP

### Resources
- README.md - Full documentation
- HTML Comments - Throughout the code
- CSS Variables - Easy to find and modify
- JavaScript Comments - Explain each function

### Common Questions

**Q: How do I add more courses?**
A: Copy a course card in `pages/courses.html` and modify.

**Q: How do I change colors?**
A: Edit CSS variables at top of `css/main.css`

**Q: How do I add images?**
A: Place in `assets/` and reference with relative paths.

**Q: Can I use this commercially?**
A: Yes! Fully free to use for personal and commercial projects.

**Q: How do I deploy?**
A: See "Deploying Online" section above.

## 🎉 YOU'RE READY!

Congratulations! You now have a professional educational website. 

**Next: Customize it with your content and launch!**

---

For full documentation, see `README.md`

**Happy Learning! 🎓**
