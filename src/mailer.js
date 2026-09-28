import createMailer from 'sendmail';
import { FROM, TO, SUBJECT, DEV_SMTP } from '../config.js';

const sendmail = createMailer({
  silent: false,
  ...(DEV_SMTP ?? {}),
});

export const send = (message) =>
  new Promise((resolve, reject) => {
    if (typeof message !== 'string' || !message.trim()) {
      return reject(new Error('message must be a non-empty string'));
    }

    sendmail({ from: FROM, to: TO, subject: SUBJECT, text: message }, (err, reply) => {
      if (err) return reject(err);
      resolve(reply);
    });
  });