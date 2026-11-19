# Specialized Services Backup - Removed January 23, 2025

This folder contains all the code for specialized services that was removed from the Taylor Movers website.

## Removed Services
1. **Specialized Services** (main category page)
2. **Piano Moving**
3. **Pet Relocation** 
4. **Furniture Assembly**
5. **Packing Services**

## Removed Files
- `pages/services/specialized-services.jsx`
- `pages/services/piano-moving.jsx`
- `pages/services/pet-relocation.jsx`
- `pages/services/furniture-assembly.jsx`
- `pages/services/packing-services.jsx`

## Modified Files
- `components/Navbar.jsx` - Removed specialized services menu items and submenu logic
- `pages/services/index.jsx` - Removed specialized services from additionalServices array
- `pages/index.js` - Removed specialized services FeatureCard
- `pages/enhanced-home-backup.js` - Removed specialized services FeatureCard
- `components/Navbar_backup.jsx` - Needs cleanup of specialized services reference

## Reason for Removal
The specialized services were causing React runtime errors due to missing icon imports (FaPiano, FaTruck, etc.) and other issues. Client requested removal of entire specialized services category.

## Restoration Instructions
To restore these services:
1. Copy the backed up page files back to `pages/services/`
2. Restore the navigation menu items in `components/Navbar.jsx`
3. Add back the services to the services index page
4. Fix any missing icon imports
5. Test all pages for functionality

## Notes
- The piano-moving.jsx file had a fixed FaPiano import issue (changed to FaMusic)
- All files were functional at time of backup, just needed icon import fixes
- SEO metadata and page structure were complete and working