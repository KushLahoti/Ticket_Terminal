import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async ({ to, subject, body }) => {
    try {
        const { data, error } = await resend.emails.send({
            // For now, we use Resend's test email address.
            // You can change this later after verifying your own domain in Resend.
            from: 'Movie Ticket App <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: body,
        });

        if (error) {
            console.error("Error sending email from Resend:", error);
            return { success: false, error };
        }

        console.log("Email sent successfully via Resend:", data);
        return { success: true, data };

    } catch (exception) {
        console.error("A critical exception occurred while sending email:", exception);
        return { success: false, error: exception };
    }
};

export default sendEmail;
