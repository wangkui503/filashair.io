import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
var nodemailer = require('nodemailer');
const json = require('@/lib/filashair-fde81c42bc94.json');
import {welcomeEmail, changePasswordEmail} from '@/lib/emailTemplates.js'
import { compare } from "bcrypt";

async function sendEmail(email, subject, html) {
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
  subject: subject,
  html: html
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
  const { email, password } = await req.json();
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (exists) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  } else {
    const has = await prisma.user.findFirst({
      
    });
    if (has) {
      return NextResponse.json({ message: "Users are only invited." }, { status: 403 });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: await hash(password, 10),
        role: 'admin'
      },
    });
    sendEmail(email, 'Welcome to filashAir', welcomeEmail(email))
    return NextResponse.json(user);
  }
}

export async function PUT(req: Request) {
  const { email, old, password } = await req.json();
  const exists = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!exists) {
    return NextResponse.json({ message: "User does not exists" }, { status: 401 });
  } else {
    if (!(await compare(old, exists.password))) {    
      return NextResponse.json({ message: "The old password doesn't match, please try again or reset if you forgot." }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: {
        email
      },
      data: {
        password: await hash(password, 10),
      },
    });
    sendEmail(email, 'Password changed at filashAir', changePasswordEmail(email))
    return NextResponse.json(user);
  }
}