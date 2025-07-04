const { IsInstalled } = require("./checkInstallation")
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const { createDatabase } = require("./createDatabase");
const { createToasts } = require("./createToasts");
const { pushDatabase } = require("./pushDatabase");
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// Templates
const nextAuthTemplate = require("./templates/auth/[...nextauth]/nextAuthTemplate");
const signInTemplate = require("./templates/auth/sign-in/signInTemplate");
const signUpTemplate = require("./templates/auth/sign-up/signUpTemplate");
const addUserTemplate = require("./templates/auth/addUser/addUserTemplate");
const providerTemplate = require("./templates/auth/providerTemplate");
const middlewareTemplate = require("./templates/auth/middlewareTemplate");


async function createAuthentication(currdir) {

  try {

    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Setting up authentication ",
      cancellable: false
    }, async (progress) => {
      const steps = [
        { message: "Toasts...", action: async () => await createToasts(currdir) },
        { message: "Database...", action: async () => await createDatabase(currdir) },

        {
          message: "Session provider...", action: async () => {

            // Session provider for layout.jsx
            const importRegex = /import\s*SessionProvider/g;
            const itemRegex = /<\s*body\s*>([\s\S]*)<\s*\/\s*body\s*>/g;
            const providerRegex = /<\s*SessionProvider\s*>/g;

            const layoutPagePath = path.join(currdir, "app", "layout.jsx");
            let layoutContent = fs.readFileSync(layoutPagePath, "utf-8");

            const matches = itemRegex.exec(layoutContent);

            if (layoutContent.search(importRegex) == -1) {
              layoutContent = `import SessionProvider from "./provider"; \n` + layoutContent;
            }
            if (layoutContent.search(providerRegex) == -1) {
              layoutContent = layoutContent.replace(matches[1], "<SessionProvider> \n" + matches[1] + "\n" + "</SessionProvider>")
            }
            fs.writeFileSync(layoutPagePath, layoutContent);

            const providerPath = path.join(currdir, "app", "provider.jsx");
            fs.writeFileSync(providerPath, providerTemplate());

            const nextAuthPath = path.join(currdir, "app", "api", "auth", "[...nextauth]");

            fs.mkdirSync(nextAuthPath, { recursive: true });

            fs.writeFileSync(path.join(nextAuthPath, "route.js"), nextAuthTemplate());

            // sign-in sign-up added
            const authPath = path.join(currdir, "app", "(auth)");
            const signInPath = path.join(authPath, "sign-in");
            const signUpPath = path.join(authPath, "sign-up");

            fs.mkdirSync(signInPath, { recursive: true });
            fs.mkdirSync(signUpPath, { recursive: true });

            fs.writeFileSync(path.join(signInPath, "page.jsx"), signInTemplate());
            fs.writeFileSync(path.join(signUpPath, "page.jsx"), signUpTemplate());

            const addUserPath = path.join(currdir, "app", "api", "auth", "addUser");
            fs.mkdirSync(addUserPath, { recursive: true });

            fs.writeFileSync(path.join(addUserPath, "route.js"), addUserTemplate());

            // middleware handling
            const middlewarePath = path.join(currdir, "middleware.js");
            fs.writeFileSync(middlewarePath, middlewareTemplate());

          }
        },

        {
          message: "Profile page...", action: async () => {
            const profilePagePath = path.join(currdir, "app", "Profile");
            const editProfilePagePath = path.join(currdir, "app", "Profile", "Edit");

            const saveUserApiPath = path.join(currdir, "app", "api","auth", "saveUser");

            if (!fs.existsSync(editProfilePagePath)) {
              fs.mkdirSync(editProfilePagePath, { recursive: true });
            }

            if (!fs.existsSync(saveUserApiPath)) {
              fs.mkdirSync(saveUserApiPath, { recursive: true });
            }

            fs.writeFileSync(path.join(profilePagePath, "page.jsx"), fs.readFileSync(path.join(__dirname, 'templates/auth/profile/profilePageTemplate.jsx')));
            fs.writeFileSync(path.join(editProfilePagePath, "page.jsx"), fs.readFileSync(path.join(__dirname, 'templates/auth/editprofile/editProfilePageTemplate.jsx')));

            fs.writeFileSync(path.join(saveUserApiPath, "route.js"), fs.readFileSync(path.join(__dirname, 'templates/auth/saveUser/saveUserTemplate.jsx')));
          }
        },

         {
          message: "Cloudinary...", action: async () => {
            if (!IsInstalled(currdir, "cloudinary")) {
              await execPromise(`npm install cloudinary`, { cwd: currdir });
            }

            const cloudinaryApiPath = path.join(currdir, "app", "api", "fileupload");
            if (!fs.existsSync(cloudinaryApiPath)) {
              fs.mkdirSync(cloudinaryApiPath, { recursive: true });
            }

            fs.writeFileSync(path.join(cloudinaryApiPath, "route.js"), fs.readFileSync(path.join(__dirname, 'templates/auth/cloudinaryApiTemplate/cloudinaryApiTemplate.jsx')));
          }
        },

        {
          message: "Next-Auth...", action: async () => {
            if (!IsInstalled(currdir, "next-auth")) {
              await execPromise(`npm install next-auth`, { cwd: currdir });
            }

          }
        },

        {
          message: "Bcryptjs...", action: async () => {
            if (!IsInstalled(currdir, "bcryptjs")) {
              await execPromise(`npm install bcryptjs`, { cwd: currdir });
            }

          }
        },

        {
          message: ".Env...", action: async () => {
            const envPath = path.join(currdir, ".env");
            let envContent = fs.readFileSync(envPath, "utf-8");

            if (!envContent.includes("GOOGLE_CLIENT_ID")) {
              envContent += "\n" + `GOOGLE_CLIENT_ID=`;
            }

            if (!envContent.includes("GOOGLE_CLIENT_SECRET")) {
              envContent += "\n" + `GOOGLE_CLIENT_SECRET=`;
            }

            if (!envContent.includes("NEXTAUTH_URL")) {
              envContent += "\n\n" + `NEXTAUTH_URL=`;
            }

            if (!envContent.toString().includes("NEXTAUTH_SECRET")) {
              try {
                const { stdout } = await execPromise(`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`, { cwd: currdir });
                envContent += `\nNEXTAUTH_SECRET=${stdout.trim()}`;
              } catch (err) {
                vscode.window.showErrorMessage("Failed to generate NEXTAUTH_SECRET");
                throw err;
              }
            }

            if (!envContent.includes("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")) {
              envContent += "\n" + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=`;
            }

            if (!envContent.includes("NEXT_PUBLIC_CLOUDINARY_API_KEY")) {
              envContent += "\n" + `NEXT_PUBLIC_CLOUDINARY_API_KEY=`;
            }

            if (!envContent.includes("CLOUDINARY_API_SECRET")) {
              envContent += "\n" + `CLOUDINARY_API_SECRET=`;
            }

            fs.writeFileSync(envPath, envContent);

          }
        },

       { message: "Pushing database...", action: async () => await pushDatabase(currdir, "UsersAdded") },


      ];

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        progress.report({ message: step.message, increment: (100 / steps.length) });
        await step.action();
      }

      vscode.window.showInformationMessage("Authentication created successfully.");
    });


  } catch (error) {
    vscode.window.showErrorMessage("Authentication setup failed: " + error.message);
    console.error(error);
  }

}

module.exports = { createAuthentication }