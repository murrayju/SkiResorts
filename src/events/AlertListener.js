import nodemailer from 'nodemailer';
import config from '@murrayju/config';
import logger from '../logger';

export default ({ emitter }) => {
  const { from, pw, to, service } = config.get('email');
  if (!from || !pw) return;
  const transporter = nodemailer.createTransport({
    service,
    auth: {
      user: from,
      pass: pw,
    },
  });
  emitter.on('AREA_OPENED', data => {
    if (!to?.length) {
      logger.debug('No email configured');
      return;
    }
    const mailOptions = {
      from,
      to,
      subject: 'SkiReport 🎿',
      text: `${data.name} at ${data.resort} is now: ${data.status}`,
    };
    logger.debug('Sending AREA_OPENED email', mailOptions);
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        logger.error(error);
      } else {
        logger.info(`Email sent: ${info.response}`);
      }
    });
  });
};
