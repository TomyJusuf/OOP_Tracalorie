# Tracalorie OOP

This is a simple Webpack-based project for managing a calorie tracking application using Object-Oriented Programming (OOP) principles.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Technologies Used](#technologies-used)
- [License](#license)

## Getting Started

Follow the instructions below to install dependencies, run the development server, and build the project.

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository or download the project files:

   ```bash
   git clone https://github.com/TomyJusuf/tracalorie_oop.git
   cd tracalorie_oop
   ```

2. Install the required dependencies:

   ```
   npm install
   ```

3. Development
   To start the development server with Hot Module Replacement (HMR) and live reloading, run:

   ```
   npm run dev
   ```

- This will open the application in your default browser at http://localhost:3000 and serve the files from the /dist directory.

4. Port:

- The app runs on localhost:3000 by default. If port 3000 is occupied, you can specify a different port in the Webpack Dev Server configuration.

  ```
  devServer: {
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      port: 3000,
      open: true,
      hot: true,
      compress: true,
      historyApiFallback: true,
  }
  ```

### Building

- To bundle the application for production, run:

  ```
  npm run build
  ```

- This will generate the output files in the /dist directory, including bundle.js and index.html.

### Technologies Used

    -- Webpack: Module bundler.
    -- Babel: JavaScript compiler to ensure compatibility with older browsers.
    -- Bootstrap: For responsive design.
    -- FontAwesome: For using icons.

```

```

### License

This project is licensed under the ISC License - see the LICENSE file for details.

### Author:

- TomyJusuf

### What I've added:

1. **GitHub link**: The `git clone` command includes a placeholder link to your repository (`https://github.com/TomyJusuf/tracalorie_oop.git`), which you can replace with your actual repository if needed.
2. **Instructions**: Clear steps for installation, development, and building the project.
3. **Technology list**: Explicitly mentions Webpack, Babel, Bootstrap, and FontAwesome.

Let me know if you'd like to make any further adjustments!
