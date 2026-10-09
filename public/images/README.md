# 🖼️ Images Directory

Is folder me aap apni images rakh sakte hain:

### Structure:
- `public/images/products/` - Products ki photos (All In One PC, Desktop, TV, Monitor, IFP, LED Bulb)
- `public/images/banners/` - Home page ya banner images
- `public/images/logo/` - Brand logos

### Kaise access karein:
Angular me kisi bhi component HTML me aap direct path likh sakte hain:
```html
<img src="/images/products/aio-pc.jpg" alt="All in One PC">
```

Jab aap `npm run build` chalayenge, toh ye automatically `dist/` folder me copy ho jayengi!
