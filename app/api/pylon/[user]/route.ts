import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
const crypto = require('crypto');

const jose = require('jose');
const xid = require('xid-js');

import genJWT from '@/lib/jwt'


export async function GET(req: Request,
  { params }: { params: { user: string } }
  ) {
  try {
  
  const token = await genJWT({}, params.user, process.env.FILASH_PYLON_SUPER_PRIVATE_KEY?.replace(/\\n/g, '\n'), process.env.FILASH_PYLON_SUPER_PUBLIC_KEY_ID)
  
  console.log("pylon token.........", token)
  return NextResponse.json(token);  
} catch(error) {
  console.log('--------------------------------',error)
  return NextResponse.json(error.message?? error, { status: 500 });  
}

}
