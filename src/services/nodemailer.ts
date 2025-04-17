/**
 * Represents the options for sending an email.
 */
export interface EmailOptions {
  /**
   * The email address of the recipient.
   */
  to: string;
  /**
   * The subject line of the email.
   */
  subject: string;
  /**
   * The HTML body of the email.
   */
  html: string;
}

/**
 * Asynchronously sends an email using Nodemailer.
 *
 * @param options The options for sending the email, including recipient, subject, and HTML body.
 * @returns A promise that resolves when the email is successfully sent.
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // TODO: Implement this by calling Nodemailer.

  console.log("Sending email to " + options.to + " with subject " + options.subject);
}
