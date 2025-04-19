# Operation

This section provides documentation about how to operate and maintain the Babysitter Timer application.

## User Guides

### How to Log In

1. Open the application in your browser
2. You will be presented with the login screen featuring:
   - A welcome message ("Bienvenue")
   - An explanation of what to do
   - Input fields for email and password
   - Two buttons: "S'inscrire" (Sign Up) and "Se connecter" (Sign In)
   - A theme toggle button to switch between light and dark modes

3. For existing users:
   - Enter your email address in the email field
   - Enter your password in the password field
   - Click the "Se connecter" (Sign In) button
   - Upon successful authentication, you will see a welcome message
   - You will be redirected to the main application interface

4. For new users:
   - Enter your desired email address in the email field
   - Enter your desired password in the password field (ensure it meets security requirements)
   - Click the "S'inscrire" (Sign Up) button
   - Upon successful registration, you will see a welcome message
   - You will be redirected to the main application interface

5. If you encounter an error:
   - An alert will display the error message
   - Check that you've entered the correct email and password
   - For sign-up errors, ensure your password meets Firebase's security requirements (at least 6 characters)

### How to Add a Babysitting Session

1. Log in to the application
2. Click the "Add Babysitting" button
3. Enter the start date and time
4. Enter the end date and time
5. Enter the price
6. Click the "Submit" button
7. The babysitting session is now added to your list

### How to Filter Babysitting Sessions

1. Log in to the application
2. Navigate to the main babysitting view
3. At the top of the screen, you'll see the filter bar with:
   - A year dropdown selector
   - A horizontally scrollable list of month buttons
   - Navigation buttons (on desktop) to move between months

4. To filter by year:
   - Click on the year dropdown
   - Select the desired year from the list
   - The babysitting entries will automatically update to show only entries from the selected year

5. To filter by month:
   - Click on a month button in the scrollable list
   - The selected month will be highlighted and centered in the visible area
   - The babysitting entries will automatically update to show only entries from the selected month and year

6. To navigate through months sequentially:
   - On desktop: Use the previous/next arrow buttons on either side of the month list
   - On mobile: Swipe left or right on the month list
   - When navigating past December, the year will automatically increment
   - When navigating before January, the year will automatically decrement

7. The filter selection is preserved during your session, allowing you to navigate to other sections of the application and return to the same filtered view

8. The filter bar remains sticky at the top of the screen as you scroll through entries, providing easy access to filtering options at all times

9. The selected filter affects:
   - The displayed babysitting entries in the list
   - The statistics shown in the stats section

### How to View Statistics

1. Log in to the application
2. Navigate to the statistics section
3. View your total hours, earnings, and other statistics
4. Apply filters to see statistics for specific time periods or price ranges

### How to Toggle Between Light and Dark Modes

1. Look for the theme toggle button in the application interface
   - On the login screen, it's located in the top-right corner
   - In the main application, it's located in the navigation bar
2. Click the toggle button to switch between light and dark modes
   - The button shows a sun icon when in dark mode (click to switch to light mode)
   - The button shows a moon icon when in light mode (click to switch to dark mode)
3. Your theme preference will be saved and remembered between sessions
4. The theme toggle is especially useful for:
   - Reducing eye strain in low-light environments (dark mode)
   - Improving readability in bright environments (light mode)
   - Accommodating personal preferences

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Firebase account

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/babysitter-timer.git
   cd babysitter-timer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase configuration:
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication and Firestore in your Firebase project
   - Create a web app in your Firebase project
   - Copy the Firebase configuration
   - Create a file named `.env.local` in the root of your project with the following content:
     ```
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment with Firebase

### Initial Firebase Setup

1. Install Firebase CLI globally:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init
   ```
   - Select Hosting
   - Select your Firebase project
   - Set the public directory to `build`
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No (unless you want to)

### Building and Deploying

1. Build the production version of your app:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

3. Your app is now live at `https://your-project-id.web.app`

### Continuous Deployment with GitHub Actions

You can set up continuous deployment using GitHub Actions:

1. Create a `.github/workflows/firebase-deploy.yml` file:
   ```yaml
   name: Firebase Deploy

   on:
     push:
       branches: [ main ]

   jobs:
     build_and_deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Use Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
         - name: Install dependencies
           run: npm ci
         - name: Run tests
           run: npm test
         - name: Build
           run: npm run build
         - name: Deploy to Firebase
           uses: w9jds/firebase-action@master
           with:
             args: deploy --only hosting
           env:
             FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
   ```

2. Generate a Firebase token:
   ```bash
   firebase login:ci
   ```

3. Add the token as a secret in your GitHub repository settings (name it `FIREBASE_TOKEN`)

4. Now, every push to the main branch will automatically deploy your app to Firebase

## Maintenance

### Updating Dependencies

Regularly update your dependencies to ensure security and performance:

```bash
npm update
```

For major updates, use:

```bash
npm outdated
npx npm-check-updates -u
npm install
```

### Monitoring

Monitor your application using Firebase Console:

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Select your project
3. Use the Analytics, Crashlytics, and Performance sections to monitor your app

### Backup

Regularly backup your Firestore data:

1. Go to the Firebase Console
2. Select your project
3. Go to Firestore
4. Click on "Export data"
5. Follow the instructions to export your data to Google Cloud Storage

### Troubleshooting Common Issues

#### Authentication Issues

If users are having trouble logging in:

1. Check Firebase Authentication console for any disabled accounts
2. Verify that the Firebase configuration is correct
3. Check for any security rules that might be blocking access

#### Data Not Loading

If babysitting data is not loading:

1. Check Firestore security rules
2. Verify that the user has the correct permissions
3. Check for any errors in the browser console

#### Deployment Issues

If deployment is failing:

1. Check that the build is successful locally
2. Verify that the Firebase CLI is correctly configured
3. Check for any errors in the deployment logs
