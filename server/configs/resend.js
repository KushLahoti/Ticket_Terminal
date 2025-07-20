import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async ({ to, subject, body }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Ticket Terminal App <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: body,
        });

        if (error) {
            console.error("Error sending email from Resend:", error);
            return { success: false, error };
        }

        return { success: true, data };

    } catch (exception) {
        console.error("A critical exception occurred while sending email:", exception);
        return { success: false, error: exception };
    }
};

export default sendEmail;
