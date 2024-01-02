
import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import { config } from "../common/config";
import { InternalServerError } from "../common/errors/internal-server-error";
import { RecipientAddress } from "../common/global";

export class EmailService {
    // EMAIL_USERNAME = 'your-email@example.com';
    // EMAIL_PASSWORD = 'your-email-password';
    // EMAIL_SERVICE = 'your-email-service';


    constructor() {

    }

    // Send a password reset email
    sendPasswordResetEmail = async (senderAddress: string, recipientsAddress: RecipientAddress[], token: string) => {
        const connectionString = config.emailConnStr;
        // const senderAddress = "contact@shivamhomeocare.com"
        // const recipientAddress = email;

        const url = config.appDomain + "/reset-password/" + token;

        const POLLER_WAIT_TIME = 10

        const message = {
            senderAddress: senderAddress,
            recipients: {
                to: recipientsAddress,
            },
            content: {
                subject: "Password Reset Email",
                plainText: "Password Reset Email",
                html: `<html>
                    <p> Dear Recipient,</p>
                    <p>We have received your request for reset password of Shivam Homeo Care account associated with this email address.</p>
                    <p>Click the link below to reset your password using our secure server:</p>
                    <br>
                    <p>
                        <a style="text-decoration: none;background-color: #E12454;color: white;padding: 12px 80px;border-radius: 20px;font-size: 16px;cursor: pointer;" href="${url}">Change my password</a>
                    </p>
                    <br>
                    <p>If clicking the link doesn't work, you can copy and paste the link into your web browser's address bar.
                     You will be able to create a new password for your Shivam Homeo Care account after clicking the link above. </p>
                    <p>If you did not request to have your password reset, you can safely ignore this email.
                        Rest assured your Shivam Homeo Care account is safe.</p> 

                    <p>Shivam Homeo Care will never email you and ask you to disclose or verify your password, credit card, or banking account number.
                    If you receive a suspicious email with a link to update your account information, do not click on the link.
                    Instead, report the e-mail to Shivam Homeo Care for investigation.</p>

                    <p>For help and support, visit the Shivam Homeo Care Support Center at  <a href= "https://shivamhomeocare.com/contact"> https://shivamhomeocare.com/contact </a></p>

                    <p>Thank you for visiting Shivam Homeo Care.</p>

                    <p>Sincerely, <br> The Shivam Homeo Care Team</p>
                    <html>`
            },
        }
        // const resetLink = `http://your-frontend-app/reset-password/${token}`;

        // const mailOptions = {
        //     from: 'your-email@example.com',
        //     to: email,
        //     subject: 'Password Reset',
        //     text: `Click on the following link to reset your password: ${resetLink}`,
        // };

        try {
            const client = new EmailClient(connectionString);

            const poller = await client.beginSend(message);

            if (!poller.getOperationState().isStarted) {
                return new InternalServerError("Poller was not started.");
            }

            let timeElapsed = 0;
            while (!poller.isDone()) {
                poller.poll();
                console.log("Email send polling in progress");

                await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
                timeElapsed += 10;

                if (timeElapsed > 18 * POLLER_WAIT_TIME) {
                    return new InternalServerError("Polling timed out.");
                }
            }

            if (poller.getResult()?.status === KnownEmailSendStatus.Succeeded) {
                console.log(`Successfully sent the email (operation id: ${poller.getResult()?.id})`);
                return true;
            }
            else {
                console.log(poller.getResult()?.error)
                return new InternalServerError('poller.getResult()?.error');

            }
        }
        catch (ex) {
            console.error(ex);
            return new InternalServerError('internal error');
        }


    };

}

export const emailService = new EmailService();
