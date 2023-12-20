import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
var nodemailer = require('nodemailer');
const json = require('@/lib/filashair-fde81c42bc94.json');
import {resetEmail} from '@/lib/emailTemplates.js'
import {generatePassword} from '@/lib/password.js'


async function sendEmail(email, password) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'filash@filash.io',
        serviceClient: json.client_id,
        privateKey: json.private_key
    }
}); 


 var mailOptions = {
  from: 'filash@filash.io',
  to: email,
  subject: 'Reset password at filashAir',
  html: resetEmail(password)
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

export async function POST(req: Request) {
  const { email } = await req.json();
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!exists) {
    return NextResponse.json({ message: "User does not exists" }, { status: 400 });
  } else {
    const password = generatePassword()
    const user = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: await hash(password, 10),
      },
    });
    sendEmail(email, password)
    return NextResponse.json({});
  }
}
