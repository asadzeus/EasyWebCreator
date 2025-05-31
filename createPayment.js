    const vscode = require('vscode');
    const fs = require("fs");
    const path = require('path');
    const { exec } = require("child_process");
    const util = require("util");
    const execPromise = util.promisify(exec);

    const paymentTemplate = require('./templates/payment/paymentTemplate.js');
    const checkoutPageTemplate = require('./templates/payment/checkoutPageTemplate');
    const checkoutFormTemplate = require('./templates/payment/checkoutFormTemplate');
    const checkoutSuccessPageTemplate = require('./templates/payment/checkoutSuccessPageTemplate');

    const {IsInstalled} = require("./checkInstallation")


    async function createPayment(currdir){ 

        
        return await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Creating payment method",
            cancellable: false, 
        },
        async (progress) => {
            const steps = [
                { message: "Installing stripe...", action: async () => {
                    if(!IsInstalled("stripe")){
                        await execPromise(`npm install stripe`, { cwd: currdir, shell: true })
                    }
                } },
                { message: "Installing @stripe/stripe-js...", action: async () =>{
                    if(!IsInstalled("@stripe/stripe-js")){
                        await execPromise(`npm install @stripe/stripe-js`, { cwd: currdir, shell: true })
                    }
                } },
                { message: "Installing @stripe/react-stripe-js...", action: async () => {
                    if(!IsInstalled("@stripe/react-stripe-js")){
                        await execPromise(`npm i @stripe/react-stripe-js`, { cwd: currdir, shell: true }) 
                    }
                }},
                
                { message: "Writing to .env...", action: async () => 
                    {
                        const envPath = path.join(currdir, ".env");

                        if(!fs.existsSync(envPath)){
                            fs.writeFileSync(envPath, "");
                        }

                        const envContent = fs.readFileSync(envPath, "utf-8");
                        let newEnvContent = envContent.trim();
                        
                        if(!newEnvContent.includes("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY")){
                            newEnvContent += `\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=`;
                        }
                        if(!newEnvContent.includes("STRIPE_SECRET_KEY")){
                            newEnvContent += `\nSTRIPE_SECRET_KEY=`;
                        }
                        if(!newEnvContent.includes("NEXT_PUBLIC_SITE_URL")){
                            newEnvContent += `\nNEXT_PUBLIC_SITE_URL=https://localhost:3000`;
                        }


                        fs.writeFileSync(envPath, newEnvContent);
                    } 
                },

                { message: "Creating payment api...", action: async () => 
                    {
                    const paymentApiPath = path.join(currdir, "app", "api", "payment")
                    const paymentApiRoutePath = path.join(paymentApiPath, "route.js")

                    if(!fs.existsSync(paymentApiPath)){
                        fs.mkdirSync(paymentApiPath, {recursive: true});
                    }

                    fs.writeFileSync(paymentApiRoutePath, paymentTemplate());
                    }
                },

                { message: "Creating checkout page...", action: async () => 
                    {
                    const checkoutPagePath = path.join(currdir, "app", "checkout")

                    if(!fs.existsSync(checkoutPagePath)){
                        fs.mkdirSync(checkoutPagePath, {recursive: true});
                    }

                    fs.writeFileSync(path.join(checkoutPagePath, "page.jsx"), checkoutPageTemplate());

                    } 
                },

                { message: "Creating checkout form...", action: async () => 
                    {
                    const checkoutFormPath = path.join(currdir, "app", "checkout")

                    if(!fs.existsSync(checkoutFormPath)){
                        fs.mkdirSync(checkoutFormPath, {recursive: true});
                    }

                    fs.writeFileSync(path.join(checkoutFormPath, "CheckoutForm.jsx"), checkoutFormTemplate());

                    } 
                },

                { message: "Creating checkout success page...", action: async () => 
                    {
                    const checkoutSuccessPagePath = path.join(currdir, "app", "checkout", "success");

                    if(!fs.existsSync(checkoutSuccessPagePath)){
                        fs.mkdirSync(checkoutSuccessPagePath, {recursive: true});
                    }

                    fs.writeFileSync(path.join(checkoutSuccessPagePath, "page.jsx"), checkoutSuccessPageTemplate());

                    } 
                },
            ];

            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                progress.report({ message: step.message, increment: (100 / steps.length) });
                await step.action();
            }

            vscode.window.showInformationMessage("Payment created successfully.");
            
            }
        );




    }

    module.exports = { createPayment };