import nodemailer from 'nodemailer';

export async function sendMail(id,email,token,res) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset password link',
      html: `https://master--password-reset-flow-react-node.netlify.app/reset/${id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error occurred while sending email');
      } else {
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully');
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Some error occurred while sending the mail');
  }
}
