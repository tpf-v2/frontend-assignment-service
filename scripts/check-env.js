const dotenv = require("dotenv");

dotenv.config({ path: ".env.production" });


let hasErrors = false;

function checkEnv(key, value) {
    if (!process.env[key]) {
        // red color
        console.error(`\x1b[31m${key} is not set\x1b[0m`);
        hasErrors = true;
    } else {
        console.log(`${key} is set to`, JSON.stringify(process.env[key]));
    }
}

checkEnv("REACT_APP_SENTRY_ENVIRONMENT");
checkEnv("REACT_APP_SENTRY_DSN");
checkEnv("REACT_APP_SENTRY_ENABLED");
checkEnv("REACT_APP_API_URL");

if (hasErrors) {
    // all in red
    console.error("\x1b[31mMISSING ENV VARIABLES. CANT BUILD.\x1b[0m");
    console.error();
    console.error("\x1b[31mSet the variables in the .env.production file or use npm run build:nosentry to build without sentry\x1b[0m");
    process.exit(1);
}