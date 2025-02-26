import axios from "axios";

export const sendEmail = async (to, subject, htmlContent,apikey) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Jenii", email: "info@jenii.in" },
        to: [{ email: to }],
        subject,
        htmlContent,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey, // Use an environment variable for security
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending email:", error.response?.data || error);
    throw new Error("Failed to send email");
  }
};
