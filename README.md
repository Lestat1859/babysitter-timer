# BabySitter Timer

## Purpose

BabySitter Timer is a web application designed to help parents track the time spent by their babysitters and calculate their payments at the end of the month. It provides a simple and intuitive interface for managing babysitting sessions and generating payment reports.

## Features

-   **Session Tracking:** Easily record the start and end times of each babysitting session.
-   **Payment Calculation:** Automatically calculate the total payment due based on hourly rates and session duration.
-   **Monthly Reports:** Generate detailed reports of all babysitting sessions and payments for a specific month.
-   **User Authentication:** Securely manage user accounts and protect sensitive data.
-   **Responsive Design:** Access the application from any device, whether it's a desktop, tablet, or smartphone.

## Documentation

The project documentation follows the DIVO framework:

- **[Design](docs/design.md)**: Architecture, component structure, data flow, and diagrams
- **[Implementation](docs/implementation.md)**: Technology stack, key components, Firebase integration, and interfaces
- **[Verification](docs/verification.md)**: Testing strategy, manual testing checklist, and pre-deployment verification
- **[Operation](docs/operation.md)**: User guides, installation, deployment with Firebase, and maintenance

For a complete overview, see the [documentation index](docs/index.md).

## Technologies Used

-   **Frontend:** ReactJS
-   **State Management:** Recoil
-   **Styling:** Tailwind CSS
-   **Deployment:** Firebase

## Install and Run

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/babysitter-timer.git
    ```
2.  Navigate to the project directory:

    ```bash
    cd babysitter-timer
    ```
3.  Install dependencies:

    ```bash
    npm install
    ```
4.  Configure Firebase:

    -   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    -   Enable Authentication and Firestore Database.
    -   Copy the Firebase configuration object from the Firebase Console and paste it into `src/utils/firebase.ts`.
5.  Start the development server:

    ```bash
    npm start
    ```
6.  Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## Deployment

For detailed deployment instructions with Firebase, see the [Operation documentation](docs/operation.md#deployment-with-firebase).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Contributing

We welcome contributions to BabySitter Timer! If you have any ideas for new features or improvements, please submit a pull request.

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive commit messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## License

This project is licensed under the [MIT License](LICENSE).
