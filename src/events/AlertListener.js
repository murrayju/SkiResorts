import nodemailer from 'nodemailer';
import config from '@murrayju/config';

export default ({ emitter }) => {
  const emailConfig = config.get('email');
  if (!emailConfig.from || !emailConfig.pw) return;
  const transporter = nodemailer.createTransport({
    service: emailConfig.service,
    auth: {
      user: emailConfig.from,
      pass: emailConfig.pw,
    },
  });
  emitter.on('AREA_OPENED', data => {
    if (!emailConfig.to || !emailConfig.length) return;
    const mailOptions = {
      from: emailConfig.from,
      to: emailConfig.to,
      subject: `${data.name} at ${data.resort} is now: ${data.status}`,
    };
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error(error);
      } else {
        console.info(`Email sent: ${info.response}`);
      }
    });
  });
};
